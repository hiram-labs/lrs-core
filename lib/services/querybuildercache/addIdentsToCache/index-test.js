import { expect } from 'chai';
import QueryBuilderCache from 'lib/models/querybuildercache';
import QueryBuilderCacheValue from 'lib/models/querybuildercachevalue';
import mongoose from 'mongoose';
import addIdentsToCache from '.';

const ObjectId = mongoose.Types.ObjectId;

const organisation = new ObjectId();
const value = 'Hello World';
const path = ['persona', 'import', 'foobar'];
const key = path.join('.');

const assertCount = (model) => (expectedCount, query) =>
  model.countDocuments(query).then((actualCount) => {
    expect(actualCount).to.equal(expectedCount);
  });

const assertCacheKeys = assertCount(QueryBuilderCache);
const assertCacheValues = assertCount(QueryBuilderCacheValue);
const uniqueIdentifier = { key: 'statement.actor.mbox', value: 'mailto:test@example.com' };

describe('addIdentsToCache', () => {
  beforeEach(async () => {
    await Promise.all([QueryBuilderCache.deleteMany({}), QueryBuilderCacheValue.deleteMany({})]);
  });

  it('should udapte the query builder cache for one ident', async () => {
    await addIdentsToCache(organisation, [uniqueIdentifier, { key, value }]);
    await Promise.all([
      assertCacheKeys(1, {
        organisation,
        path,
        searchString: key,
        valueType: 'String'
      }),
      assertCacheValues(1, {
        organisation,
        path: key,
        hash: JSON.stringify(value),
        value,
        display: value,
        valueType: 'String',
        searchString: JSON.stringify(value)
      })
    ]);
  });

  it('should not update the query builder cache for no idents', async () => {
    await addIdentsToCache(organisation, [uniqueIdentifier]);
    await Promise.all([assertCacheKeys(0, {}), assertCacheValues(0, {})]);
  });
});
