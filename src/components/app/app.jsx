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
    const lines = getCellsGroupedByCoordinate(axis, cells);
    console.log(lines);

    lines.forEach((line, indexLine) => {
      const isToEndDirection = direction === `end`;
      let values = getLineCellsValues(line);
      if (values.length) {
        if (!isToEndDirection) values = values.reverse();
        values = sumEqualSiblings(values);
        if (!isToEndDirection) values = values.reverse();

        const valuesWithoutZeroes = removeZeroes(values);
        const missingZeros = new Array(line.length - values.length).fill(0);

        let resultValues = [...valuesWithoutZeroes, ...missingZeros];

        if (isToEndDirection) {
          resultValues = [...missingZeros, ...valuesWithoutZeroes];
        }

        resultValues.forEach((value, indexValue) => {
          lines[indexLine][indexValue].value = value;
        });
      }

      setCells(lines.flat());
    });

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

  let api = new API(backendServers.find((server) => server.isSelected).value);

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
