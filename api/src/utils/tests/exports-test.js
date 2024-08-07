import chai from 'chai';
import path from 'path';
import stream from 'stream';
import ExportDBHelper from 'api/utils/tests/exportsDBHelper';
import { streamToCsv, groupStreams } from 'api/utils/exports';
import { getConnection } from 'lib/connections/mongoose';
import highland from 'highland';
import Statement from 'lib/models/statement';
import _ from 'lodash';

const connection = getConnection();

const { expect } = chai;
const exportDBHelper = new ExportDBHelper();

describe('Export helper tests', () => {
  beforeEach(async () => {
    await Statement.deleteMany({});
  });

  before((done) => {
    if (connection.readyState !== 1) {
      connection.on('connected', () => {
        done();
      });
    } else {
      done();
    }
  });

  beforeEach('Set up statements for testing', (done) => {
    try {
      exportDBHelper.prepare(done);
    } catch (e) {
      console.error(e);
    }
  });

  afterEach('Clear db collections', (done) => {
    exportDBHelper.cleanUp(done);
  });

  describe('groupStreams', () => {
    it('should take 2 streams and output a single stream with length 3', () => {
      const xStream = highland(exportDBHelper.xStream);
      const yStream = highland(exportDBHelper.yStream);
      const singleStream = groupStreams([xStream, yStream]);

      singleStream.toArray((res) => {
        expect(res).to.deep.equal(exportDBHelper.singleStream);
      });
    });
  });

  describe('streamToCsv', () => {
    const testPath = path.join(__dirname, 'testcsv.csv');
    //
    // afterEach(() => {
    //   fs.unlinkSync(testPath);
    // });

    it('should take a stream and store it to a file', () => {
      const testStream = highland(_.values(exportDBHelper.statements));
      return streamToCsv(['_id'], testStream, testPath).then((csvStream) => {
        expect(csvStream).to.not.be.null;
        expect(csvStream).to.be.instanceOf(stream.Readable);
      });
    });

    it('should zip 3 streams and store them to a file', () => {
      const testStream1 = highland(_.map(exportDBHelper.statements, (statement) => statement.toObject()));
      const testStream2 = highland(_.map(exportDBHelper.statements, (statement) => statement.toObject()));
      const testStream3 = highland(_.map(exportDBHelper.statements, (statement) => statement.toObject()));
      const singleStream = groupStreams([testStream1, testStream2, testStream3]);
      return streamToCsv(['_id'], singleStream, testPath).then((csvStream) => {
        expect(csvStream).to.not.be.null;
        expect(csvStream).to.be.instanceOf(stream.Readable);
      });
    });
  });
});
