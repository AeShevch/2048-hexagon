import PropTypes from "prop-types";

const cellPropTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  z: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default cellPropTypes;
