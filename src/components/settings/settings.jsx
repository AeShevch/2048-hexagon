import ServerSelect from "./server-select/server-select";
import LevelSelect from "./level-select/level-select";

const Settings = ({onLevelChange, onServerChange, backendServers, level}) => {
    return (
      <form className="settings" aria-label="Game settings">
          <ServerSelect
              onChange={onServerChange}
              options={backendServers}
          />
          <LevelSelect onChange={onLevelChange} currentLevel={level}/>
      </form>
    );
};

export default Settings;