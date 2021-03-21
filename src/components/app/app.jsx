import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import API from "../../api/api";
import Board from "../board/board";
import Settings from "../settings/settings";
import {
  generateInitialBoardData,
  isControlKey,
  isEqual,
  sumEqualSiblings,
  getCellsGroupedByCoordinate,
  sortByDirection,
  getLineCellsValues,
  removeZeroes,
} from "../../utils/utils";
import servers from "../../api/servers";

const App = () => {
  const [status, setStatus] = useState(`settings`);
  const [level, setLevel] = useState(0);
  const [cells, setCells] = useState([]);
  const [backendServers, setSelectedBackendServer] = useState(servers);

  let api = new API(backendServers.find((server) => server.isSelected).value);

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
    const nonEmptyCells = currentCells.filter(({ value }) => value);
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
    const { hash } = window.location;
    if (hash && hash.includes(`#test`)) {
      const newLevel = +hash.replace(/\D/g, "");
      setLevel(newLevel);
    }
  };

  /*
  * Handlers
  * */
  const onMount = () => {
    setLevelFromAnchor();
  };

  const onKeyDown = ({ code }) => {
    isControlKey(code, (axis, direction) => {
      shiftBoard(axis, direction);
    });
  };

  const onCellsChange = () => {
    if (cells.length) {
      const isGameOver = checkGameOver();

      if (isGameOver) {
        setStatus(`game-over`);
      }
    }
  };

  const onSettingsChange = () => {
    if (!!level) {
      const newCells = generateInitialBoardData(level);
      updateBoardFromServer(newCells);

      setStatus(`playing`);
    }
  };

  /*
  * Use effects
  * */
  useEffect(onMount, []);
  useEffect(onCellsChange, [cells]);
  useEffect(onSettingsChange, [backendServers, level]);

  /*
  * Template
  * */
  return (
    <section className="game" role="application" aria-label="Hexagonal 2048">
      <Settings
        backendServers={backendServers}
        onServerChange={updateBackendServer}
        onLevelChange={setLevel}
        level={level}
      />
      {!!level && (
        <Board onKeyDown={onKeyDown} tabIndex={0} cells={cells} level={level} />
      )}
      <div role="alert">
        Game Status: <span data-status={status}>{status}</span>
      </div>
    </section>
  );
};

export default App;
