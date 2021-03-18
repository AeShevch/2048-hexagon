import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import API from "../../api/api";
import Board from "../board/board";
import Settings from "../settings/settings";
import { generateInitialBoardData, isControlKey } from "../../utils/utils";
import servers from "../../api/servers";

const App = () => {
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

  const getLineCellsValues = (line) =>
    line.reduce((accum, { value }) => {
      if (value) {
        accum.push(value);
      }
      return accum;
    }, []);

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
      };
    }

    return result;
  };

  const removeZeroes = (array) => array.filter(value => value);

  const shiftBoard = (axis, direction) => {
    // Получениям ячейки, группированные по линиям нужных направлений
    const lines = getCellsGroupedByCoordinate(axis, cells);
    // Проходим по каждой линии
    lines.forEach((line, indexLine) => {
      // Получеем массив value каждой ячейки в линии (Без нулей)
      let values = getLineCellsValues(sortByDirection(line, direction));
      // Если хотя бы в одной ячейки в линии есть value
      if (values.length) {
        // Складываем значения соседних ячеек TODO Правильно ли складывает? НЕПРАВИЛЬНО!
        const summedValues = sumEqualSiblings(values);

        // После сложения, появились нулевые value => убираем их
        const valuesWithoutZeroes = removeZeroes(summedValues);
        // Собираем недостающие нули в массив
        const missingZeros = new Array(line.length - valuesWithoutZeroes.length).fill(0);

        // Собираем новый массив value. В зависимости от направления, добавляем нули в конец или начало
        let resultValues = [...missingZeros, ...valuesWithoutZeroes];

        // Обновляем исходный массив ячеек новыми value indexValue равен индексу ячейки
        resultValues.forEach((value, indexValue) => {
          lines[indexLine][indexValue].value = value;
        });
      }
    });

    updateBoardFromServer(lines.flat());
  };

  const onKeyDown = (keyCode) => {
    isControlKey(keyCode, (axis, direction) => {
      shiftBoard(axis, direction);

    });
  };

  const getUpdatedCells = (currentCells, newCells) => {
    if (!currentCells.length) currentCells = generateInitialBoardData(level);

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


  const updateBoardFromServer = (currentCells = []) => {
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

  useEffect(() => {
    updateBoardFromServer();
    // eslint-disable-next-line
  }, [backendServers, level]);

  return (
    <section
      tabIndex={0}
      onKeyDown={({ code }) => onKeyDown(code)}
      className="game"
      role="application"
      aria-label="Hexagonal 2048"
    >
      <Settings
        backendServers={backendServers}
        onServerChange={updateBackendServer}
        onLevelChange={setLevel}
      />
      {!!level && <Board cells={cells} level={level} />}
    </section>
  );
};

export default App;
