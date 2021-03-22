import statusPropTypes from "./status.prop";

const Status = ({status}) => (
  <div className={`game__status status status_${status}`} role="alert">
    Game Status: <b data-status={status}>{status}</b>
  </div>
);

export default Status;

Status.propTypes = statusPropTypes;
