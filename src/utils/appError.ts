
class AppError extends Error {
    statusCode : number ;
    status: string ;

    constructor(message : string, statusCode :number) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('2') ? 'success' : 'failed';

      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;