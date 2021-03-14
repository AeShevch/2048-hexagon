import React from "react";
// import PropTypes from "prop-types";
/*[
  { x: 0, y: -1, z: 1, value: 2 },
  { x: 0, y: 1, z: -1, value: 2 },
  { x: 1, y: -1, z: 0, value: 2 },
];*/
const Board = ({ cells, radius }) => {
  const boardWidth = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
          "--board-width"
      )
  );

  console.log(boardWidth);

  const hexagonSize = boardWidth / (radius * 2 + (radius - 1));
  const hexagonWidth =  hexagonSize * 2;
  const hexagonHeight = Math.sqrt(3) / 2 * hexagonWidth;

  const getCellOffset = ({ x, y, z }) => {

  };

  // const getHexagonStyles = () => {
  //   return
  // };

  return (
    <div className="board">
      {cells.map(({x, y, z, value}, index) => (
        <div
            className="board__cell"
            data-x={x}
            data-y={y}
            data-z={z}
            data-value={value}
            style={{
              width: `${hexagonWidth}px`,
              height: `${hexagonHeight}px`,
              transform: `translateY(${((z + x/2) * hexagonHeight)}px) translateX(${(x) * (hexagonWidth*3/4)}px)`
            }}
            key={index}
        >
          {value}
        </div>
      ))}
    </div>
  );
};

export default Board;
