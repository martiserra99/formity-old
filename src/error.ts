/**
 * Error class for when a form is not valid.
 */
class NotValidFormError extends Error {
  constructor(message: string = 'The form is not valid') {
    super(message);
    this.name = 'NotValidFormError';
  }
}

export { NotValidFormError };
