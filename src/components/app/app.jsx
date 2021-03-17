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
    const result = values;
    result.forEach((value, i) => {
      if (i && value === result[i - 1]) {
        result[i - 1]+= value;
        result[i] = 0;
      }
    });

    return result;
  };

  const removeZeroes = (array) => array.filter(value => value);

  const shiftBoard = (axis, direction) => {
    // Получениям ячейки, группированные по линиям нужных направлений
    const lines = getCellsGroupedByCoordinate(axis, cells);
    const tmp = lines.slice();
    console.log("line Before", tmp);

    // Проходим по каждой линии
    lines.forEach((line, indexLine) => {
      const isToEndDirection = direction === `start`;
      // Получеем массив value каждой ячейки в линии (Без нулей)
      let values = getLineCellsValues(sortByDirection(line, direction));
      // Если хотя бы в одной ячейки в линии есть value
      if (values.length) {
        // Складываем значения соседних ячеек TODO Правильно ли складывает? НЕПРАВИЛЬНО!
        // values = sumEqualSiblings(values);

        // После сложения, появились нулевые value => убираем их
        const valuesWithoutZeroes = removeZeroes(values);
        // Собираем недостающие нули в массив
        const missingZeros = new Array(line.length - values.length).fill(0);

        // Собираем новый массив value. В зависимости от направления, добавляем нули в конец или начало
        let resultValues = [...missingZeros, ...valuesWithoutZeroes];

        // Обновляем исходный массив ячеек новыми value indexValue равен индексу ячейки
        resultValues.forEach((value, indexValue) => {
          lines[indexLine][indexValue].value = value;
        });
      }
    });

    const tmp2 = lines.slice();
    // console.log("line Before", tmp2);

    console.log("line After", lines);
    // TODO Отправляем на сервер обновлённые ячейки, ожидая получить новые, но почему-то получаем не всегда
    // updateBoardFromServer(lines.flat());
    setCells(lines.flat());
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
    api.getNewCellsForGameLevel(level, currentCells).then((newCells) => {
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
