export default class ApiError extends Error {
    constructor(
        _statusCode,
        _message,
        _source
    ) {
      super()
    }
  }
  
  export class NotFoundError extends ApiError {
    constructor( message = 'Not Found', source) {
      super(404, message, source)
    }
  }
  
  export class ForbiddenError extends ApiError {
    constructor( message = 'Forbidden', source) {
      super(403, message, source)
    }
  }
  
  export class InternalServerError extends ApiError {
    constructor(
       message = 'Internal Server Error',
      source
    ) {
      super(500, message, source)
    }
  }
  
  export class UnauthorizedError extends ApiError {
    constructor(
       message = 'Unauthorized Request',
      source
    ) {
      super(401, message, source)
    }
  }
  
  export class BadRequestError extends ApiError {
    constructor( message = 'Bad Request', source) {
      super(400, message, source)
    }
  }
  