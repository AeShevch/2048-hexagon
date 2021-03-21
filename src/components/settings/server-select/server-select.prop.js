import PropTypes from "prop-types";
import serversProp from "../../../api/servers/servers.prop";

export default {
  onServerChange: PropTypes.func.isRequired,
  backendServers: serversProp,
};
