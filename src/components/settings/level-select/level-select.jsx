import levelSelectPropTypes from "./level-select.prop";
import { BASE_LEVELS } from "../../../const";

const LevelSelect = ({ onChange, currentLevel }) => (
  <fieldset
    className="settings__level fieldset"
    onChange={({ target }) => onChange(+target.value)}
  >
    <legend>Choose game level</legend>
    <div className="fieldset__inner">
      {BASE_LEVELS.map((level) => (
        <div className="custom-radio" key={level}>
          <label htmlFor={`radio-level-${level}`}>Radius {level}</label>
          <input
            id={`radio-level-${level}`}
            value={level}
            defaultChecked={currentLevel === level}
            name="set-level-radio"
            type="radio"
          />
        </div>
      ))}
    </div>
  </fieldset>
);

export default LevelSelect;

LevelSelect.propTypes = levelSelectPropTypes;
