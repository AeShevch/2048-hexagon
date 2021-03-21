const ServerSelect = ({ onChange, options }) => {
  const currentServer = options.find(({ isSelected }) => isSelected);
  return (
    <label className="settings__backend-url-select" id="url-server">
      RNG-server url:
      <select
        id="url-server"
        defaultValue={currentServer.value}
        onChange={(evt) => onChange(evt.target.value)}
      >
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
