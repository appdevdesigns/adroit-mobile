export const filterItems = (filter, allItems, displayKey) => {
  const filterRegExp = RegExp(`\\b${filter}`, 'i');
  return allItems.filter(item => filterRegExp.test(item[displayKey]));
};
