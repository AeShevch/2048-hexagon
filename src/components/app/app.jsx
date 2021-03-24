import React, { useState, useEffect, useMemo } from "react";
import API from "../../api/api.ts";
import Board from "../board/board";
import Settings from "../settings/settings";
import Status from "../status/status";
import {
  generateInitialBoardData,
  isControlKey,
  shiftBoard,
  checkGameOver,
  checkWin,
  getUpdatedCells,
  getAnchorValue,
} from "../../business-logic/business-logic.ts";

import { getSelected } from "../../utils/utils";
import servers from "../../api/servers/servers";
import { GameStatuses } from "../../const";
import "./app.scss";

const App = () => {
  /*
   * State
   * */
  const [status, setStatus] = useState(GameStatuses.SETTINGS);
  const [level, setLevel] = useState(0);
  const [cells, setCells] = useState([]);
  const [backendServers, setSelectedBackendServer] = useState(servers);

  /*
   * Initializing the api
   * */
  const api = useMemo(() => {
    const selectedServer = getSelected(backendServers);
    return new API(selectedServer.url);
  }, [backendServers]);

  /*
   * Handlers
   * */
  const onMount = () => {
    const levelFromAnchor = getAnchorValue();
    if (levelFromAnchor) {
      setLevel(levelFromAnchor);
    }
  };

  const onKeyDown = ({ code }) => {
    isControlKey(code, (unchangingAxis, increasingAxis) => {
      shiftBoard(unchangingAxis, increasingAxis, cells, (shiftedCells) => {
        getUpdatedCells(api, shiftedCells, level).then((updatedCells) =>
          setCells(updatedCells)
        );
      });
    });
  };

  const onCellsChange = () => {
    if (cells.length) {
      const isGameOver = checkGameOver(cells);
      const isWin = checkWin(cells);

      if (isGameOver) {
        setStatus(GameStatuses.GAME_OVER);
      }

      if (isWin) {
        setStatus(GameStatuses.VICTORY);
      }
    }
  };

  const onServerChange = () => {
    const newServerUrl = getSelected(backendServers);
    api.endPointChange(newServerUrl.url);
  };

  const onSettingsChange = () => {
    if (!!level) {
      const newCells = generateInitialBoardData(level);
      getUpdatedCells(api, newCells, level).then((updatedCells) =>
        setCells(updatedCells)
      );

      setStatus(GameStatuses.PLAYING);
    }
  };

  /*
   * Use effects
   * */
  useEffect(onMount, []);
  useEffect(onCellsChange, [cells]);
  useEffect(onServerChange, [backendServers, api]);
  useEffect(onSettingsChange, [backendServers, level, api]);

  /*
   * Template
   * */
  return (
    <section
      className="game"
      role="application"
      aria-label="Hexagonal 2048 Game"
    >
      <Settings
        backendServers={backendServers}
        onServerChange={setSelectedBackendServer}
        onLevelChange={setLevel}
        level={level}
      />
      <Status status={status}/>
      {!!level && (
        <Board
          onKeyDown={onKeyDown}
          cells={cells}
          level={level}
          status={status}
        />
      )}
    </section>
  );
};

export default App;
