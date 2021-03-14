const LevelSelect = ({ onChange }) => {
  const levels = [2, 3, 4];
  return (
    <fieldset
      className="settings__level fieldset"
      onChange={(evt) => onChange(evt.target.value)}
    >
      <div className="fieldset__inner">
        {levels.map((level, index) => (
          <div className="custom-radio" key={index}>
            <label htmlFor={`radio-level-${level}`}>{level}</label>
            <input
              id={`radio-level-${level}`}
              value={level}
              name="set-level-radio"
              type="radio"
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default LevelSelect;
