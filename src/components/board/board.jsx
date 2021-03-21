import Cell from "./cell/cell";
import {GameStatuses} from "../../const";

// import PropTypes from "prop-types";

const Board = ({cells, level, status, onKeyDown}) => {
  const boardWidth = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--board-width"
    )
  );

  const hexagonSize = boardWidth / (level * 2 + (level - 1));
  const hexagonWidth = hexagonSize * 2;
  const hexagonHeight = Math.sqrt(3) / 2 * hexagonWidth;

  return (
    <section
      {...(status !== GameStatuses.VICTORY ? { onKeyDown } : {})}
      tabIndex={0}
      ref={(board) => board && board.focus()}
      autoFocus={true}
      className="board"
      aria-label="Game Board"
    >
      {cells.map(({ x, y, z, value }, index) => (
        <Cell
          x={x}
          y={y}
          z={z}
          value={value}
          width={hexagonWidth}
          height={hexagonHeight}
          key={index}
        />
      ))}
    </section>
  );
};

export default Board;
