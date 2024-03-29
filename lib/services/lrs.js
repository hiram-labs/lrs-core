import Promise from 'bluebird';
import Lrs from 'lib/models/lrs';

export const updateStatementCountsInOrg = async (organisationId) => {
  const lrsList = await Lrs.find({ organisation: organisationId });
  await Promise.map(lrsList, Lrs.updateStatementCount);
};
