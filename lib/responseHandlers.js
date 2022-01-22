import { Failure, Success } from '#lib/responseHelpers';

// # Catch all error handler(fallback)
export const finalErrorHandler = async (err, req, res, next) =>
  console.error(err) & res.status(500).send('An internal error occurred. Please try again later');

// # Standard error handler
export const standardErrorHandler = async (err, req, res, next) =>
  // # Double response checker for error
  res.headersSent
    ? console.error('[Error] Sent already:', err)
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
    ? next(new Failure(err.message, 400))
    : err.name === 'TypeError'
    ? next(new Failure(err.message, 400, 'INTERNAL'))
    : next(err);

// # Standard success handler
export const standardSuccessHandler = async (req, res, next) =>
  // # Double response checker
  res.headersSent
    ? console.log('[Normal] Sent already:', req.x)
    : // # Handle response
    req.x && req.x instanceof Success && req.x.type !== 'INTERNAL'
    ? console.log(req.x) & res.status(req.x.statusCode).json(req.x)
    : req.x
    ? // # This condition occures when an invalid value gets set as response
      // # It shouldn't occur, but if it occurs, something messed up really bad
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
          req.originalUrl +
            ' - Did you forget to return a value as response in the router handler?',
          500,
          'FORGOT_RETURN'
        )
      );
