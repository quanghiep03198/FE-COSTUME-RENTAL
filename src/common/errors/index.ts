export class RetriableError extends Error {}
export class FatalError extends Error {}
export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
    this.name = 'UnauthorizedError'
  }
}
