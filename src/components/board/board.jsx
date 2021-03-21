import boardPropTypes from "./board.prop";
import Cell from "./cell/cell";
import { GameStatuses, BOARD_CSS_VARIABLE_NAME } from "../../const";
import {calcCellWidth, calcCellHeight} from "../../business-logic/business-logic";


const Board = ({ cells, level, status, onKeyDown }) => {
  // Getting the width of the board from the css variable "--board-width"
  const boardWidth = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(BOARD_CSS_VARIABLE_NAME)
  );

  const cellWidth = calcCellWidth(boardWidth, level);
  const cellHeight = calcCellHeight(cellWidth);

  return (
    <section
      id="game-board"
      {...(status !== GameStatuses.VICTORY ? { onKeyDown } : {})}
      tabIndex={0}
      ref={(board) => board && board.focus()}
      autoFocus={true}
      className="board"
      aria-label="Game Board"
    >
      {cells.map(({ x, y, z, value }) => (
        <Cell
          x={x} y={y} z={z}
          value={value}
          width={cellWidth}
          height={cellHeight}
          key={`${x}${y}${z}`}
        />
      ))}
    </section>
  );
};

export default Board;

Board.propTypes = boardPropTypes;