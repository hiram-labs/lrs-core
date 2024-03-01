import { get } from 'lodash';

export default (statement) => {
  const registration = get(statement, ['context', 'registration'], undefined);
  if (registration === undefined) {
    return [];
  }
  return [registration];
};
