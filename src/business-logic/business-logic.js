import { isEqual, removeZeroes } from "../utils/utils";
import { WIN_VALUE, AXES } from "../const";

/**
 * Calculates the width of a hexagonal cell
 * @param {Number} boardWidth - The width of game board
 * @param {Number} radius - Board radius (Game level)
 * @returns {Number}
 *
 * @see {@link https://www.redblobgames.com/grids/hexagons/}
 */
export const calcCellWidth = (boardWidth, radius) => {
  const cellSize = boardWidth / (radius * 2 + (radius - 1));
  return cellSize * 2;
};

/**
 * Calculates the height of a hexagonal cell
 * @param {Number} cellWidth - The width of a hexagonal cell
 * @returns {Number}
 *
 * @see {@link https://www.redblobgames.com/grids/hexagons/}
 */
export const calcCellHeight = (cellWidth) => (Math.sqrt(3) / 2) * cellWidth;

/**
 * Calculates the vertical offset of the cell from the center of the board
 * @param {Number} z - Z-axis coordinate
 * @param {Number} x - X-axis coordinate
 * @param {Number} height - Cell height
 * @returns {Number}
 *
 * @see {@link https://www.redblobgames.com/grids/hexagons/}
 */
export const calcCellShiftVertical = (z, x, height) => (z + x / 2) * height;

/**
 * Calculates the horizontal offset of the cell from the center of the board
 * @param {Number} x - X-axis coordinate
 * @param {Number} width - Cell width
 * @returns {Number}
 *
 * @see {@link https://www.redblobgames.com/grids/hexagons/}
 */
export const calcCellShiftHorizontal = (x, width) => (x * width * 3) / 4;

/**
 * Generates cells with empty values for the board of the specified radius
 * @param {Number} radius - Board radius (Game level)
 * @returns {{x: Number, y: Number, z: Number, value: Number}[]}
 *
 * @see {@link https://www.redblobgames.com/grids/hexagons/}
 */
export const generateInitialBoardData = (radius) => {
  const results = [];
  const n = radius - 1;

  for (let x = -n; x <= n; x++) {
    for (let y = Math.max(-n, -x - n); y <= Math.min(n, -x + n); y++) {
      const z = -x - y;
      results.push({ x, y, z, value: 0 });
    }
  }

  return results;
};

/**
 * Matching the pressed key to the axis
 *
 * Each increasingAxis corresponds to two axis:
 * "unchangingAxis" - the name of the axis, the coordinate of which does not change when shifting
 * and "increasingAxis" - the name of the axis, the coordinate of which changes by +1
 *
 */
const keyCodeToAxis = {
  KeyQ: {
    unchangingAxis: "z",
    increasingAxis: "y",
  },
  KeyW: {
    unchangingAxis: "x",
    increasingAxis: "y",
  },
  KeyE: {
    unchangingAxis: "y",
    increasingAxis: "x",
  },
  KeyA: {
    unchangingAxis: "y",
    increasingAxis: "z",
  },
  KeyS: {
    unchangingAxis: "x",
    increasingAxis: "z",
  },
  KeyD: {
    unchangingAxis: "z",
    increasingAxis: "x",
  },
};

/**
 * Gets the axes corresponding to the pressed key
 * @param {String} keyCode - evt.code of pressed key
 * @returns {{unchangingAxis: String, increasingAxis: String}[]}
 *
 * @example
 * // returns ["x", "y"]
 * getKeyInfo('KeyW');
 */
const getKeyInfo = (keyCode) => Object.values(keyCodeToAxis[keyCode]);

/**
 * Checks whether one of the control keys was pressed, executes a callback if true
 * @param {String} keyCode - evt.code of pressed key
 * @param {function(unchangingAxis:string, increasingAxis:string)} callback - executes if one of the control keys was pressed
 */
export const isControlKey = (keyCode, callback) => {
  if (Object.keys(keyCodeToAxis).includes(keyCode)) {
    callback(...getKeyInfo(keyCode));
  }
};

/**
 * Sums adjacent cells with the same values in the array.
 * @param {Number[]} values - Array of cell values
 * @returns {Number[]}
 *
 * @example
 * // returns [0, 4]
 * sumEqualSiblings([2, 2]);
 *
 * @example
 * // returns [0, 2, 4]
 * sumEqualSiblings([2, 2, 2]);
 *
 * @example
 * // returns [2, 4, 2]
 * sumEqualSiblings([2, 4, 2]);
 */
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

/**
 * Groups cells by an immutable coordinate
 * @param {String} unchangingAxis
 * @param {{x: Number, y: Number, z: Number, value: Number}[]} cells - Array of cells
 * @returns {{x: Number, y: Number, z: Number, value: Number}[][]}
 *
 * @example
 * // returns
 * // [
 * //  [
 * //    { "x": 0, "y": -1, "z": 1, "value": 0},
 * //    { "x": 0, "y": 0, "z": 0, "value": 0},
 * //    { "x": 0, "y": 1, "z": -1, "value": 0}
 * //  ],
 * //  [
 * //    { "x": 1, "y": -1, "z": 0, "value": 2},
 * //    { "x": 1, "y": 0, "z": -1, "value": 2}
 * //  ],
 * //  [
 * //    { "x": -1, "y": 0, "z": 1, "value": 0},
 * //    { "x": -1, "y": 1, "z": 0, "value": 2}
 * //  ],
 * // ]
 *
 *  getCellsGroupedByCoordinate("x", [
 *   {"x": -1, "y": 0, "z": 1, "value": 0},
 *   {"x": -1, "y": 1, "z": 0, "value": 2},
 *   {"x": 0, "y": -1, "z": 1, "value": 0},
 *   {"x": 0, "y": 0, "z": 0, "value": 0},
 *   {"x": 0, "y": 1, "z": -1, "value": 0},
 *   {"x": 1, "y": -1, "z": 0, "value": 2},
 *   {"x": 1, "y": 0, "z": -1, "value": 2}
 *   ]);
 */
export const getCellsGroupedByCoordinate = (unchangingAxis, cells) => {
  const groupedCells = cells.reduce((acc, cell) => {
    const axisCoordinate = cell[unchangingAxis];

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

/**
 * Sorts cells by increasing the specified coordinate
 * @param {{x: Number, y: Number, z: Number, value: Number}[]} line
 * @param {("x"|"y"|"z")} increasingAxis
 * @returns {{x: Number, y: Number, z: Number, value: Number}[]}
 */
export const sortByDirection = (line, increasingAxis) =>
  line.sort((a, b) => a[increasingAxis] - b[increasingAxis]);

/**
 * Converts an array of cells to an array of cell values
 * @param {{x: Number, y: Number, z: Number, value: Number}[]} line
 * @returns {Number[]}
 */
export const getLineCellsValues = (line) => line.map(({ value }) => value);

/**
 * Checks if there are still possible shifts
 * @param {{x: Number, y: Number, z: Number, value: Number}[]} cells - Array of cells
 * @returns {boolean}
 */
export const checkGameOver = (cells) => {
  let gameIsOver = true;

  AXES.forEach((axis) => {
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

/**
 * Checks whether a cell with the maximum number exists
 * @param {{x: Number, y: Number, z: Number, value: Number}[]} cells - Array of cells
 * @returns {boolean}
 */
export const checkWin = (cells) =>
  cells.some(({ value }) => value === WIN_VALUE);

/**
 * Shifts cells, performs a callback if the shift is made
 * @param {("x"|"y"|"z")} unchangingAxis
 * @param {("x"|"y"|"z")} increasingAxis
 * @param {{x: Number, y: Number, z: Number, value: Number}[]} cells - Array of cells
 * @param {Function} callback
 */
export const shiftBoard = (unchangingAxis, increasingAxis, cells, callback) => {
  let shifted = false;

  const lines = getCellsGroupedByCoordinate(unchangingAxis, cells);

  lines.forEach((line, indexLine) => {

    const sortedLine = sortByDirection(line, increasingAxis);
    const values = getLineCellsValues(sortedLine);
    const valuesWithoutZeroes = removeZeroes(values);

    if (valuesWithoutZeroes.length) {
      const summedValues = sumEqualSiblings(valuesWithoutZeroes);
      const newValuesWithoutZeroes = removeZeroes(summedValues);

      const missingZeros = new Array(
        line.length - newValuesWithoutZeroes.length
      ).fill(0);

      let resultValues = [...missingZeros, ...newValuesWithoutZeroes];

      if (!isEqual(values, resultValues)) {
        shifted = true;

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

/**
 * Updates the current cells with new ones
 * @param {{x: Number, y: Number, z: Number, value: Number}[]} currentCells - Array of currentCells
 * @param {{x: Number, y: Number, z: Number, value: Number}[]} newCells - Array of newCells
 * @returns {{x: Number, y: Number, z: Number, value: Number}[]}
 */
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

/**
 * Sends non-empty cells to the server and returns new ones
 * @param {Object} api - instance of Api
 * @param {{x: Number, y: Number, z: Number, value: Number}[]} currentCells - Array of currentCells
 * @param {Number} level - Game level (Radius)
 * @returns {Promise<{x: Number, y: Number, z: Number, value: Number}[]>}
 */
export const getUpdatedCells = (api, currentCells, level) => {
  const nonEmptyCells = currentCells.filter(({ value }) => value);

  return api
    .getNewCellsForGameLevel(level, nonEmptyCells)
    .then((newCells) => getMergedCells(currentCells, newCells));
};

/**
 * If the url contains the anchor "#test.." returns the level, if not returns false
 * @returns {boolean|number}
 */
export const getAnchorValue = () => {
  const { hash } = window.location;
  if (hash && hash.includes(`#test`)) {
    return +hash.replace(/\D/g, ``);
  }

  return false;
};
