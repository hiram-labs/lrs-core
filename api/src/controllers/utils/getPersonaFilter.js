import mongoose from 'mongoose';
import isString from 'lodash/isString';

const ObjectId = mongoose.Types.ObjectId;

export default (personaVal, personaKey = 'persona') => {
  if (!personaVal) {
    return {};
  }

  if (isString(personaVal)) {
    return { [personaKey]: new ObjectId(personaVal) };
  }

  return {
    [personaKey]: personaVal
  };
};
