export class AppError extends Error {

  constructor(
    public override message: string,
    public HttpStatus = 500,
  ) {
    super(message)

    Error.captureStackTrace(this, AppError)

    this.name = this.constructor.name
  }
}
