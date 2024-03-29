import { getConnection } from 'lib/connections/mongoose';
import { schema } from './statement';

const StatementOrgSample = getConnection().model('StatementOrgSample', schema, 'statementOrgSamples');
export default StatementOrgSample;
