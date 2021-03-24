import { Method } from "../const";
import { Cell } from "../business-logic/business-logic";

/**
 * Checking the server response
 * @param {Response} response - server response
 * @return {Response|Error} - Processed status of the server response
 */
const checkStatus = (response: Response): Response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

interface RequestParams {
  url: string;
  method: string;
  headers?: Headers;
  body: string | null; // TODO Is any type for JSON
}


/**
 * Class for working with the server
 */
export default class API {
  _endPoint: string;

  /**
   * @constructor
   * @param {string} endPoint - server url
   */
  constructor(endPoint: string) {
    this._endPoint = endPoint;
  }

  public endPointChange(newEndPoint: string): void {
    this._endPoint = newEndPoint;
  }

  /**
   * Request new cells for a board with the specified radius
   * @param {number} level - Game level (Radius)
   * @param {Cell[]} nonEmptyCells - Non-empty cells
   * @returns {Promise<Cell[]>}
   */
  public getNewCellsForGameLevel(
    level: number,
    nonEmptyCells: Cell[] = []
  ): Promise<Cell[]> {
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
  private _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }: RequestParams): Promise<Response> {
    return fetch(`${this._endPoint}/${url}`, {
      method,
      body,
      headers,
    })
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
