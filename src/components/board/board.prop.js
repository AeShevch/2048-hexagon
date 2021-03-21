import PropTypes from "prop-types";
import cellPropTypes from "./cell/cell.prop";

const boardPropTypes = {
  cells: PropTypes.arrayOf(cellPropTypes).isRequired,
  level: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  onKeyDown: PropTypes.from.isRequired,
};

export default boardPropTypes;
