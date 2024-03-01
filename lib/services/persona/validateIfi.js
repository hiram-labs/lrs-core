import validateMailto from '@hiram-labs/lrs-xapi-validation/dist/regexValues/mailto';
import validateIri from '@hiram-labs/lrs-xapi-validation/dist/regexValues/iri';
import validateSha1 from '@hiram-labs/lrs-xapi-validation/dist/regexValues/sha1';
import {
  restrictToSchema,
  required,
  checkType,
  maybe,
  restrictToCollection
} from '@hiram-labs/lrs-js-common/dist/warnings';

export const validateIfi = (ifi, path) => {
  const valuePath = [...path, 'value'];
  if (ifi.key === 'mbox') {
    return validateMailto(ifi.value, valuePath);
  }
  if (ifi.key === 'mbox_sha1sum') {
    return validateSha1(ifi.value, valuePath);
  }
  if (ifi.key === 'openid') {
    return validateIri(ifi.value, valuePath);
  }
  if (ifi.key === 'account') {
    return restrictToSchema({
      homePage: required(validateIri),
      name: required(checkType(String))
    })(ifi.value, valuePath);
  }
  return ['invalid key'];
};

export const validateIfis = maybe(restrictToCollection(() => validateIfi));

export default maybe(validateIfi);
