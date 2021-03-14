import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import API from "../../api/api";
import Board from "../board/board";

const SERVER_URL = `//68f02c80-3bed-4e10-a747-4ff774ae905a.pub.instances.scw.cloud`;
const api = new API(SERVER_URL);

const App = () => {
  const [initialCells, setInitialCells] = useState([
    { x: 0, y: 1, z: -1, value: 0 },
    { x: 1, y: 0, z: -1, value: 0 },
    { x: -1, y: 1, z: 0, value: 0 },
    { x: 0, y: 0, z: 0, value: 0 },
    { x: 1, y: -1, z: 0, value: 0 },
    { x: -1, y: 0, z: 1, value: 0 },
    { x: 0, y: -1, z: 1, value: 0 },
  ]);

  const [radius] = useState(2);

  const updateCells = (newCells) => {
    const updatedCells = initialCells.map((cell) => {
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

    setInitialCells(updatedCells);
  };

  useEffect(() => {
    api.getNewCellsForGameLevel(2)
        .then((newCells) => updateCells(newCells));
  }, []);

  return <Board cells={initialCells} radius={radius} />;
};

export default App;
