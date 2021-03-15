import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import API from "../../api/api";
import Board from "../board/board";
import Settings from "../settings/settings";
import {generateInitialBoardData} from "../utils/utils";

const App = () => {


  const [level, setLevel] = useState(0);
  const [cells, setCells] = useState([]);
  const [backendServers, setSelectedBackendServer] = useState([
    {
      id: `remote`,
      value: `//68f02c80-3bed-4e10-a747-4ff774ae905a.pub.instances.scw.cloud`,
      isSelected: true,
    },
    {
      id: `localhost`,
      value: `http://localhost:13337`,
      isSelected: false,
    },
  ]);

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
    <div className="game">
      <Settings
        backendServers={backendServers}
        onServerChange={updateBackendServer}
        onLevelChange={setLevel}
      />
      {!!level && <Board cells={cells} level={level} />}
    </div>
  );
};

export default App;
