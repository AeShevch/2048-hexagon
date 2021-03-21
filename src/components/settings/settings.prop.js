import PropTypes from "prop-types";
import serversProp from "../../api/servers/servers.prop";

const settingsPropTypes = {
  level: PropTypes.number.isRequired,
  backendServers: serversProp,
  onServerChange: PropTypes.func.isRequired,
  onLevelChange: PropTypes.func.isRequired,
};

export default settingsPropTypes;
