/**
 * Generic Application Error
 * @abstract
 *
 */

interface IAppError extends Error {
  statusCode: number | string
  type: string
}

/**
 * Defines a baseplate for application errors
 * @class
 * @param {string} message - Gives the error message to be displayed
 * @param {number} statusCode - Gives the status code of the error following the REST convention
 * @param {number} type - Gives the type of error for socket.io and other purposes
 */
export class AppError extends Error implements IAppError {
  statusCode: number
  type: string
  constructor(message: string, statusCode = 500, type = 'Error') {
    super(message)
    this.statusCode = statusCode
    this.type = type
  }
}

export class NotFoundError extends Error implements IAppError {
  statusCode: number
  type: string
  constructor(object: string, status = 404, overwrite = 'Not found', type = 'Error') {
    const message = object ? `${object} not found` : overwrite
    super(message)
    this.statusCode = status
    this.type = type
  }
}

export class AccessError extends Error implements IAppError {
  statusCode: number
  type: string
  constructor(message = 'Access Denied', status = 401, type = 'Error') {
    super(message)
    this.statusCode = status
    this.type = type
  }
}

export class ForbiddenError extends Error implements IAppError {
  statusCode: number
  type: string
  constructor(message = "You can't carry out this action", statusCode = 403, type = 'Error') {
    super(message)
    this.statusCode = statusCode
    this.type = type
  }
}

export class RequestError extends Error implements IAppError {
  statusCode: number
  type: string
  constructor(message = 'Invalid Request', statusCode = 400, type = 'Error') {
    super(message)
    this.statusCode = statusCode
    this.type = type
  }
}
