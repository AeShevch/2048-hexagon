export const isEqual = (x, y) => {
  return JSON.stringify(x) === JSON.stringify(y);
};
export const removeZeroes = (array) => array.filter((value) => value);

export const getSelected = (array) => array.find(({ isSelected }) => isSelected);
