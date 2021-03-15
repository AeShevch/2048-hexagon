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
    return cells.reduce((acc, cell) => {
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
  }

  const shiftCells = (axis, direction) => {
    const lines = getCellsGroupedByCoordinate(axis, cells);

    console.log(lines);
    // lines.forEach((line))

  };

  const onKeyDown = (keyCode) => {
    isControlKey(keyCode, (axis, direction) => shiftCells(axis, direction));
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
