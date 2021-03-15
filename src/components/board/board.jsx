// import PropTypes from "prop-types";
import Cell from "./cell/cell";

const Board = ({cells, level}) => {
  const boardWidth = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--board-width"
    )
  );

  const hexagonSize = boardWidth / (level * 2 + (level - 1));
  const hexagonWidth = hexagonSize * 2;
  const hexagonHeight = Math.sqrt(3) / 2 * hexagonWidth;

  return (
    <section className="board" aria-label="Game Board">
      {cells.map(({x, y, z, value}, index) => (
        <Cell
          x={x} y={y} z={z} value={value}
          width={hexagonWidth}
          height={hexagonHeight}
          key={index}
        />
      ))}
    </section>
  );
};

export default Board;
