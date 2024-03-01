import values from 'lodash/values';
import supertestApi from 'lib/connections/supertestApi';
import { getConnection } from 'lib/connections/mongoose';
import createOrg from 'api/routes/tests/utils/models/createOrg';
import awaitReadyConnection from './awaitReadyConnection';

const connection = getConnection();
const apiApp = supertestApi();
const deleteAllData = async () => {
  await Promise.all(values(connection.models).map((model) => model.deleteMany({})));
};
export default () => {
  before(async (done) => {
    await awaitReadyConnection(connection);
    await deleteAllData();
    done();
  });

  beforeEach('Set up organisation for testing', async (done) => {
    await Promise.all([createOrg()]);
    done();
  });

  afterEach('Clear db collections', async (done) => {
    await deleteAllData();
    done();
  });

  return apiApp;
};
