import serverSelectPropTypes from "./server-select.prop";
import { getSelected } from "../../../utils/utils";

const ServerSelect = ({ onServerChange, backendServers }) => {
  const currentServer = getSelected(backendServers);

  const onChange = (evt) =>
    onServerChange(
      backendServers.map((server) => ({
        ...server,
        isSelected: server.url === evt.target.value,
      }))
    );

  return (
    <label className="settings__backend-url-select" id="url-server">
      RNG-server url:
      <select
        id="url-server"
        defaultValue={currentServer.url}
        onChange={onChange}
      >
        {backendServers.map(({ url, id, name }) => (
          <option id={id} value={url} key={url}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
};

export default ServerSelect;

ServerSelect.propTypes = serverSelectPropTypes;
