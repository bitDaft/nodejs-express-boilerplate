import { Failure, Success } from '#lib/responseHelpers';

// # Catch all error handler(fallback)
export const finalErrorHandler = async (err, req, res, next) =>
  console.error(err) & res.status(500).send('An internal error occurred. Please try again later');

// # Standard error handler
export const standardErrorHandler = async (err, req, res, next) =>
  // # Double response checker for error
  res.headersSent
    ? console.error('[FAILURE] Sent already: ', err)
    : // # Handle error
    err instanceof Failure && err.type !== 'INTERNAL'
    ? console.error(err) & res.status(err.statusCode).json(err)
    : next(err);

export const normalErrorHandler = async (err, req, res, next) =>
  // # Handle error
  err instanceof Failure
    ? next(err)
    : err.name === 'UnauthorizedError'
    ? next(new Failure('Unauthorized', 401))
    : err.name === 'ValidationError'
    ? next(new Failure(err.message, 500, 'VALIDATION_ERROR'))
    : err.name === 'TypeError'
    ? next(new Failure(err.message, 500, 'INTERNAL'))
    : next(err);

// # Standard success handler
export const standardSuccessHandler = async (req, res, next) =>
  // # Double response checker
  res.headersSent
    ? console.info('[SUCCESS] Sent already: ', req.x)
    : // # Handle response
    req.x && req.x instanceof Success && req.x.type !== 'INTERNAL'
    ? console.info(req.x) & res.status(req.x.statusCode).json(req.x)
    : req.x && req.x instanceof Success
    ? // # This condition occurs when a success object type has been marked as internal
      // # usually when the success data is null or undefined
      // # Normally such a case would not be needed, but if it is used, it will be changed to a Failure
      next(new Failure('Success marked as internal : ' + JSON.stringify(req.x), 500, 'INTERNAL'))
    : req.x
    ? // # This condition occures when an invalid value gets set as response
      // # It shouldn't occur, but if it occurs, something messed up really bad, probably
      next(
        new Failure(
          'Did not find properly formatted response data to send, instead got : ' +
            JSON.stringify(req.x),
          500,
          'INTERNAL'
        )
      )
    : // # This condition occur for routes which forgot to return a value
      next(
        new Failure(
          `Did you forget to return a value as response for route ${req.originalUrl}?`,
          500,
          'INTERNAL'
        )
      );
