export const generateInitialBoardData = (level) => {
  const results = [];
  const n = level - 1;

  for (let x = -n; x <= n; x++) {
    for (let y = Math.max(-n, -x - n); y <= Math.min(n, -x + n); y++) {
      const z = -x - y;
      results.push({ x, y, z, value: 0 });
    }
  }

  return results;
};

const keyCodeToAxis = {
  KeyQ: {
    name: "z",
    direction: "y",
  },
  KeyW: {
    name: "x",
    direction: "y",
  },
  KeyE: {
    name: "y",
    direction: "x",
  },
  KeyA: {
    name: "y",
    direction: "z",
  },
  KeyS: {
    name: "x",
    direction: "z",
  },
  KeyD: {
    name: "z",
    direction: "x",
  },
};

const getKeyInfo = (keyCode) => Object.values(keyCodeToAxis[keyCode]);

export const isControlKey = (keyCode, action) => {
  if (Object.keys(keyCodeToAxis).includes(keyCode)) {
    action(...getKeyInfo(keyCode));
  }
};

export const isEqual = (x, y) => {
  return JSON.stringify(x) === JSON.stringify(y);
};

export const sumEqualSiblings = (values) => {
  const result = values.slice();
  if (result.length && result.length > 1) {
    for (let i = result.length; i >= 0; i--) {
      const currentValue = result[i];
      const prevValue = result[i - 1];
      if (prevValue && currentValue === prevValue) {
        result[i] += currentValue;
        result[i - 1] = 0;
      }
    }
  }

  return result;
};

export const getCellsGroupedByCoordinate = (axis, cells) => {
  const groupedCells = cells.reduce((acc, cell) => {
    const axisCoordinate = cell[axis];

    if (!acc[axisCoordinate]) {
      acc[axisCoordinate] = [];
    }

    return {
      ...acc,
      [axisCoordinate]: [...acc[axisCoordinate], cell],
    };
  }, {});

  return Object.values(groupedCells);
};

export const sortByDirection = (line, direction) => {
  return line.sort((a, b) => a[direction] - b[direction]);
};

export const getLineCellsValues = (line) => line.map(({ value }) => value);

export const removeZeroes = (array) => array.filter((value) => value);
