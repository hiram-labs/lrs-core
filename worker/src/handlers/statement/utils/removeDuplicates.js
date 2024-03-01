const removeDuplications = (
  elements,
  mapper,
  uniqueElements,
  existingValues
) => {
  if (elements.length === 0) {
    return uniqueElements;
  }
  const [element, ...nextElements] = elements;
  const value = mapper(element);
  const isUniqueValue = existingValues.indexOf(value) === -1;
  const nextUniqueElements = isUniqueValue ? [...uniqueElements, element] : uniqueElements;
  const nextExistingValues = isUniqueValue ? [...existingValues, value] : existingValues;
  return removeDuplications(nextElements, mapper, nextUniqueElements, nextExistingValues);
};

export default (arr, mapper) => removeDuplications(arr, mapper, [], []);
