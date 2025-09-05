class ExpressError extends Error {
  constructor(statusCode = 500, message = "Something Went Wrong ╰(*°▽°*)╯") {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

export {ExpressError};