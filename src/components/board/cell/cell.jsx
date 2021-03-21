import PropTypes from "prop-types";
import cellPropTypes from "./cell.prop";
import {calcCellShiftHorizontal, calcCellShiftVertical} from "../../../business-logic/business-logic";

const Cell = ({ x, y, z, value, width, height }) => {
  const cellShiftVertical = calcCellShiftVertical(z, x, height);
  const cellShiftHorizontal = calcCellShiftHorizontal(x, width);

  return (
    <div
      className="board__cell"
      aria-label={`Game cell – x:${x}, y: ${y}, z: ${z}, value: ${value}`}
      data-x={x} data-y={y} data-z={z}
      data-value={value}
      style={{
        width: `${width}em`,
        height: `${height}em`,
        transform: `translateY(${cellShiftVertical}em) translateX(${cellShiftHorizontal}em)`,
      }}
    >
      <b style={{ color: "white" }}>{!!value && value}</b>
    </div>
  );
};

export default Cell;

Cell.propTypes = {
    ...cellPropTypes,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
};
