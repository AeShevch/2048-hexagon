import settingsPropTypes from "./settings.prop";

import ServerSelect from "./server-select/server-select";
import LevelSelect from "./level-select/level-select";

const Settings = ({ onLevelChange, onServerChange, backendServers, level }) => {
  return (
    <form
      className="settings"
      aria-label="Game settings"
      aria-controls="game-board"
    >
      <ServerSelect
        onServerChange={onServerChange}
        backendServers={backendServers}
      />
      <LevelSelect onChange={onLevelChange} currentLevel={level} />
    </form>
  );
};

export default Settings;

Settings.propTypes = settingsPropTypes;
