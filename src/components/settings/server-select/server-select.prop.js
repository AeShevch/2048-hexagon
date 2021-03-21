import PropTypes from "prop-types";
import serversProp from "../../../api/servers/servers.prop";

const serverSelectPropTypes = {
  onServerChange: PropTypes.func.isRequired,
  backendServers: serversProp,
};

export default serverSelectPropTypes;
