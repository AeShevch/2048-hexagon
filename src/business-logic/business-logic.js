import { isEqual, removeZeroes } from "../utils/utils";
import { WIN_VALUE } from "../const";

export const calcCellWidth = (boardWidth, radius) => {
  const cellSize = boardWidth / (radius * 2 + (radius - 1));
  return cellSize * 2;
};

export const calcCellHeight = (cellWidth) => (Math.sqrt(3) / 2) * cellWidth;

export const calcCellShiftVertical = (z, x, height) => (z + x / 2) * height;
export const calcCellShiftHorizontal = (x, width) => (x * width * 3) / 4;

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

export const checkGameOver = (cells) => {
  let gameIsOver = true;

  [`x`, `y`, `z`].forEach((axis) => {
    const lines = getCellsGroupedByCoordinate(axis, cells);

    lines.forEach((line) => {
      const sortedLine = sortByDirection(line, axis);
      const values = getLineCellsValues(sortedLine);
      const valuesWithoutZeroes = removeZeroes(values);
      const summedValues = sumEqualSiblings(valuesWithoutZeroes);

      if (
        valuesWithoutZeroes.length < values.length ||
        summedValues.includes(0)
      ) {
        gameIsOver = false;
      }
    });
  });

  return gameIsOver;
};

export const checkWin = (cells) =>
  cells.some(({ value }) => value === WIN_VALUE);

export const shiftBoard = (axis, direction, cells, callback) => {
  let shifted = false;
  // Получениям ячейки, группированные по линиям нужных направлений
  const lines = getCellsGroupedByCoordinate(axis, cells);
  // Проходим по каждой линии
  lines.forEach((line, indexLine) => {
    // Получеем массив value каждой ячейки в линии (Без нулей)
    const sortedLine = sortByDirection(line, direction);
    const values = getLineCellsValues(sortedLine);
    const valuesWithoutZeroes = removeZeroes(values);

    // Если хотя бы в одной ячейки в линии есть value
    if (valuesWithoutZeroes.length) {
      // Складываем значения соседних ячеек
      const summedValues = sumEqualSiblings(valuesWithoutZeroes);

      // После сложения, появились нулевые value => убираем их
      const newValuesWithoutZeroes = removeZeroes(summedValues);

      // Собираем недостающие нули в массив
      const missingZeros = new Array(
        line.length - newValuesWithoutZeroes.length
      ).fill(0);

      // Собираем новый массив value. В зависимости от направления, добавляем нули в конец или начало
      let resultValues = [...missingZeros, ...newValuesWithoutZeroes];

      if (!isEqual(values, resultValues)) {
        shifted = true;

        // Обновляем исходный массив ячеек новыми value indexValue равен индексу ячейки
        resultValues.forEach((value, indexValue) => {
          lines[indexLine][indexValue].value = value;
        });
      }
    }
  });

  if (shifted) {
    callback(lines.flat());
  }
};

export const getMergedCells = (currentCells, newCells) => {
  return currentCells.map((cell) => {
    const correspondingCell = newCells.find(
      ({ x, y, z }) => x === cell.x && y === cell.y && z === cell.z
    );

    if (correspondingCell) {
      return {
        ...cell,
        value: correspondingCell.value,
      };
    } else {
      return cell;
    }
  });
};

export const getUpdatedCells = (api, currentCells, level) => {
  const nonEmptyCells = currentCells.filter(({ value }) => value);

  return api
    .getNewCellsForGameLevel(level, nonEmptyCells)
    .then((newCells) => getMergedCells(currentCells, newCells));
};

export const getAnchorValue = () => {
  const { hash } = window.location;
  if (hash && hash.includes(`#test`)) {
    return +hash.replace(/\D/g, ``);
  }

  return false;
};
