// import PropTypes from "prop-types";

const Board = ({ cells, level }) => {
  const boardWidth = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
          "--board-width"
      )
  );

  const hexagonSize = boardWidth / (level * 2 + (level - 1));
  const hexagonWidth =  hexagonSize * 2;
  const hexagonHeight = Math.sqrt(3) / 2 * hexagonWidth;

  return (
    <section className="board" aria-label="Game Board">
      {cells.map(({x, y, z, value}, index) => (
        <div
            className="board__cell"
            aria-label={`Game cell – x:${x}, y: ${y}, z: ${z}, value: ${value}`}
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
    </section>
  );
};

export default Board;
