import PropTypes from "prop-types";

export default PropTypes.arrayOf(
    PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        isSelected: PropTypes.bool.isRequired,
    })
)