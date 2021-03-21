import PropTypes from "prop-types";
import cellPropTypes from "./cell/cell.prop";

const boardPropTypes = {
  cells: PropTypes.arrayOf(PropTypes.shape(cellPropTypes)).isRequired,
  level: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  onKeyDown: PropTypes.func.isRequired,
};

export default boardPropTypes;
