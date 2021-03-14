import ServerSelect from "./server-select/server-select";
import LevelSelect from "./level-select/level-select";

const Settings = ({onLevelChange, onServerChange, backendServers}) => {
    return (
      <form className="settings" aria-label="Game settings">
          <ServerSelect
              onChange={onServerChange}
              options={backendServers}
          />
          <LevelSelect onChange={onLevelChange}/>
      </form>
    );
};

export default Settings;