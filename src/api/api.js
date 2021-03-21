import {Method} from "../const";

/**
 * Checking the server response
 * @param {Response} response - server response
 * @return {Response|Error} - Processed status of the server response
 */
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

/**
 * Class for working with the server
 */
export default class API {
  /**
   * @constructor
   * @param {String} endPoint - server url
   */
  constructor(endPoint) {
    this._endPoint = endPoint;
  }

  endPointChange(newEndPoint) {
    this._endPoint = newEndPoint;
  }

  /**
   * Request new cells for a board with the specified radius
   * @param {Number} level - Game level (Radius)
   * @param {{x: Number, y: Number, z: Number, value: Number}[]} nonEmptyCells - Non-empty cells
   * @returns {Promise<any>}
   */
  getNewCellsForGameLevel(level, nonEmptyCells = []) {
    return this._load({
      url: level.toString(),
      method: Method.POST,
      body: JSON.stringify(nonEmptyCells),
    }).then((response) => response.json());
  }

  /**
   * Makes a server request
   * @param {String} url - Request url
   * @param {String} method - Request method
   * @param {String} body - Request body
   * @param {Headers} headers - Request headers
   * @return {Promise<Response>}
   * @private
   */
  _load({ url, method = Method.GET, body = null, headers = new Headers() }) {
    return fetch(`${this._endPoint}/${url}`, { method, body, headers })
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
