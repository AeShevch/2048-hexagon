const ServerSelect = ({ onChange, options }) => {
  return (
    <label className="settings__backend-url-select" id="url-server">
      RNG-server url:
      <select id="url-server" onChange={(evt) => onChange(evt.target.value)}>
        {options.map(({ value, id }, index) => (
          <option id={id} value={value} key={index}>
            {value}
          </option>
        ))}
      </select>
    </label>
  );
};

export default ServerSelect;
