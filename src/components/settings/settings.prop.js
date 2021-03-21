import PropTypes from "prop-types";
import serversProp from "../../api/servers/servers.prop";

export default {
    level: PropTypes.number.isRequired,
    backendServers: serversProp,
    onServerChange: PropTypes.func.isRequired,
    onLevelChange: PropTypes.func.isRequired,
};