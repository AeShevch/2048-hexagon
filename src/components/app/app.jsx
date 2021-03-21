import React, { useState, useEffect, useRef } from "react";
// import PropTypes from "prop-types";
import API from "../../api/api";
import Board from "../board/board";
import Settings from "../settings/settings";
import { generateInitialBoardData, isControlKey, isEqual } from "../../utils/utils";
import servers from "../../api/servers";

const App = () => {
  const [status, setStatus] = useState(`settings`);
  const [level, setLevel] = useState(0);
  const [cells, setCells] = useState([]);
  const [backendServers, setSelectedBackendServer] = useState(servers);

  let api = new API(backendServers.find((server) => server.isSelected).value);

  const getCellsGroupedByCoordinate = (axis, cells) => {
    const groupedCells = cells.reduce((acc, cell) => {
      const axisCoordinate = cell[axis];

      if (!acc[axisCoordinate]) {
        acc[axisCoordinate] = [];
      }

      return {
        ...acc,
        [axisCoordinate]: [
          ...acc[axisCoordinate],
          cell
        ]
      }
    }, {});

    return Object.values(groupedCells);
  }

  const sortByDirection = (line, direction) => {
    return line.sort((a, b) => a[direction] - b[direction]);
  };

  const getLineCellsValues = (line) => line.map(({ value }) => value);

  const sumEqualSiblings = (values) => {
    const result = values.slice();
    if (result.length && result.length > 1) {
      for (let i = result.length; i >= 0; i--) {
        const currentValue = result[i];
        const prevValue = result[i-1];
        if (prevValue && currentValue === prevValue) {
          result[i]+= currentValue;
          result[i-1] = 0;
        }
      }
    }

    return result;
  };

  const removeZeroes = (array) => array.filter(value => value);

  const shiftBoard = (axis, direction) => {
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
      updateBoardFromServer(lines.flat());
    }
  };

  const checkGameOver = () => {
    let gameIsOver = true;

    [`x`, `y`, `z`].forEach((axis) => {
      const lines = getCellsGroupedByCoordinate(axis, cells);

      lines.forEach((line) => {
        const sortedLine = sortByDirection(line, axis);
        const values = getLineCellsValues(sortedLine);
        const valuesWithoutZeroes = removeZeroes(values);
        const summedValues = sumEqualSiblings(valuesWithoutZeroes);

        if (valuesWithoutZeroes.length < values.length || summedValues.includes(0)) {
          gameIsOver = false;
        }
      });
    });

    return gameIsOver;
  };

  const onKeyDown = ({ code }) => {
    isControlKey(code, (axis, direction) => {
      shiftBoard(axis, direction);
    });
  };

  const getUpdatedCells = (currentCells, newCells) => {
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


  const updateBoardFromServer = (currentCells) => {
    const nonEmptyCells = currentCells.filter(({value}) => value);
    api.getNewCellsForGameLevel(level, nonEmptyCells).then((newCells) => {
      const updatedCells = getUpdatedCells(currentCells, newCells);
      setCells(updatedCells);
    });
  };

  const updateBackendServer = (newServerUrl) => {
    setSelectedBackendServer(
      backendServers.map((server) => ({
        ...server,
        isSelected: server.value === newServerUrl,
      }))
    );

    api = new API(newServerUrl);
  };

  const setLevelFromAnchor = () => {
    const {hash} = window.location;
    if (hash && hash.includes(`#test`)) {
      const newLevel = +hash.replace(/\D/g,'');
      setLevel(newLevel);
    }
  };

  useEffect(() => {
    setLevelFromAnchor();

  }, []);


  useEffect(() => {
    if (!!level) {
      const newCells = generateInitialBoardData(level);
      updateBoardFromServer(newCells);

      setStatus(`playing`);
    }
    // eslint-disable-next-line
  }, [backendServers, level]);

  useEffect(() => {


    const isGameOver = checkGameOver();

    if (isGameOver) {
      setStatus(`game-over`);
    }
  }, [cells])

  return (
    <section
      className="game"
      role="application"
      aria-label="Hexagonal 2048"
    >
      <Settings
        backendServers={backendServers}
        onServerChange={updateBackendServer}
        onLevelChange={setLevel}
        level={level}
      />
      {!!level && <Board
          onKeyDown={onKeyDown}
          tabIndex={0}
          cells={cells}
          level={level}
      />}
      <div>Game Status: <span data-status={status}>{status}</span></div>
    </section>
  );
};

export default App;
