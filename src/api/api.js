// Методы для запросов по сети
const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

/**
 * Проверка ответа сервера
 * @param {Response} response - Ответ сервера
 * @return {Response|Error} - Обработанный статус ответа сервера
 */
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

/** Класс для работы с сетью */
export default class API {
  /**
   * @constructor
   * @param {String} endPoint - Адрес сервера
   */
  constructor(endPoint) {
    this._endPoint = endPoint;
  }

  /**
   * Запрос новых ячеек для поля с указанным радиусом
   * @param {Number} level - Радиус поля (Уровень игры)
   * @returns {Promise<any>}
   */
  getNewCellsForGameLevel(level) {
    return this._load({ url: level.toString(), headers: new Headers({mode:'no-cors', 'Access-Control-Allow-Origin': '*'}) })
        .then((response) => response.json());
  }

  /**
   * Метод для работы с сетью
   * @param {String} url - URL запроса
   * @param {String} method - Метод запрса
   * @param {String} body - Тело запроса
   * @param {Headers} headers - Заголовки запроса
   * @return {Promise<Response>} - Промис работы с методом
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
