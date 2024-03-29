import { fromJS, Map } from 'immutable';
import { get } from 'lodash';
import { AUTH_TYPE_TOKEN, AUTH_TYPE_BASIC_AUTH } from 'lib/constants/statementForwarding';

export const getAuthHeaders = ({ configuration }) => {
  if (configuration.authType === AUTH_TYPE_TOKEN) {
    return fromJS({
      Authorization: `Bearer ${configuration.secret}`
    });
  } else if (configuration.authType === AUTH_TYPE_BASIC_AUTH) {
    const basicAuth1 = `${configuration.basicUsername}:${configuration.basicPassword}`;
    const basicAuth2 = Buffer.from(basicAuth1).toString('base64');

    return fromJS({
      Authorization: `Basic ${basicAuth2}`
    });
  }
  return fromJS({});
};

export const getHeaders = function getHeaders(model, statement) {
  let headers;
  if (model instanceof Map) {
    headers = fromJS(JSON.parse(model.getIn(['configuration', 'headers'], '{}')));
  } else {
    headers = fromJS(JSON.parse(get(model, ['configuration', 'headers'], '{}')));
  }

  if (headers.get('X-Experience-API-Version')) {
    return headers;
  }
  if (statement) {
    return headers.set('X-Experience-API-Version', get(statement, ['statement', 'version'], '1.0.3')); // eslint-disable-line no-template-curly-in-string
  }
  return headers;
};
