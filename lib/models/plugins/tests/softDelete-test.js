/* eslint-disable no-unused-expressions */
import mongoose from 'mongoose';
import { getConnection } from 'lib/connections/mongoose';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import softDeletePlugin from 'lib/models/plugins/softDelete';

const schemaFactory = (fields, pluginOpts = {}) => {
  const schema = new mongoose.Schema(fields);
  schema.plugin(softDeletePlugin, pluginOpts);
  return getConnection().model('Test', schema, 'testModel');
};

describe('softDeletePlugin', () => {
  describe('default options', function describeTest() {
    this.timeout(10000);
    let TestModel;
    before('setup schema', (done) => {
      TestModel = schemaFactory({
        field1: String,
        field2: String,
        field3: String
      });
      done();
    });

    it('should set delete and DELETED_AT', async () => {
      const data = {
        field1: faker.company.bsBuzz(),
        field2: faker.company.bsBuzz(),
        field3: faker.company.bsBuzz()
      };
      const newItem = new TestModel(data);
      return new Promise((resolve, reject) => {
        newItem
          .save()
          .then(() => {
            newItem.softDeleteHandler((err, doc) => {
              expect(doc.deleted).to.be.true;
              expect(doc.DELETED_AT).to.exist;
              expect(doc.field1).to.equal(data.field1);
              expect(doc.field2).to.equal(data.field2);
              expect(doc.field3).to.equal(data.field3);
              err ? reject(err) : resolve();
            });
          })
          .catch(reject);
      });
    });
  });

  describe('options: deletedAt', () => {
    let TestModel;
    before('setup schema', () => {
      TestModel = schemaFactory(
        {
          field1: String,
          field2: String,
          field3: String
        },
        { deletedAt: false }
      );
    });

    it('should set delete only', async () => {
      const data = {
        field1: faker.company.bsBuzz(),
        field2: faker.company.bsBuzz(),
        field3: faker.company.bsBuzz()
      };
      const newItem = new TestModel(data);
      return new Promise((resolve, reject) => {
        newItem
          .save()
          .then(() => {
            newItem.softDeleteHandler((err, doc) => {
              expect(doc.deleted).to.be.true;
              expect(doc.DELETED_AT).to.not.exist;
              expect(doc.field1).to.equal(data.field1);
              expect(doc.field2).to.equal(data.field2);
              expect(doc.field3).to.equal(data.field3);
              err ? reject(err) : resolve();
            });
          })
          .catch(reject);
      });
    });
  });

  describe('options: flush:keep', () => {
    let TestModel;
    before('setup schema', () => {
      TestModel = schemaFactory(
        {
          field1: { type: String },
          field2: { type: String },
          field3: { type: String }
        },
        { flush: { keep: ['field1', 'field2'] } }
      );
    });

    it('should keep field1 and field2', () => {
      const data = {
        field1: faker.company.bsBuzz(),
        field2: faker.company.bsBuzz(),
        field3: faker.company.bsBuzz()
      };
      const newItem = new TestModel(data);
      return new Promise((resolve, reject) => {
        newItem
          .save()
          .then(() => {
            newItem.softDeleteHandler((err, doc) => {
              expect(doc.deleted).to.be.true;
              expect(doc.DELETED_AT).to.exist;
              expect(doc.field1).to.equal(data.field1);
              expect(doc.field2).to.equal(data.field2);
              expect(doc.field3).to.be.null;
              err ? reject(err) : resolve();
            });
          })
          .catch(reject);
      });
    });
  });

  describe('options: flush:remove', () => {
    let TestModel;
    before('setup schema', () => {
      TestModel = schemaFactory(
        {
          field1: { type: String },
          field2: { type: String },
          field3: { type: String }
        },
        { flush: { remove: ['field2'] } }
      );
    });

    it('should remove field2', () => {
      const data = {
        field1: faker.company.bsBuzz(),
        field2: faker.company.bsBuzz(),
        field3: faker.company.bsBuzz()
      };
      const newItem = new TestModel(data);
      return new Promise((resolve, reject) => {
        newItem
          .save()
          .then(() => {
            newItem.softDeleteHandler((err, doc) => {
              expect(doc.deleted).to.be.true;
              expect(doc.DELETED_AT).to.exist;
              expect(doc.field1).to.equal(data.field1);
              expect(doc.field2).to.be.null;
              expect(doc.field3).to.equal(data.field3);
              err ? reject(err) : resolve();
            });
          })
          .catch(reject);
      });
    });
  });
});
