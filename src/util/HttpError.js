export default class HttpError extends Error {
  constructor(message, status, json) {
    super(message);
    this.message = message;
    this.status = status;
    this.json = json;
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
    this.stack = new Error().stack;
  }
}
