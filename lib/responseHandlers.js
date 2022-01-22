import { Failure, Success } from '#lib/responseHelpers';

// #Catch all error handler(fallback)
export const finalErrorHandler = async (err, req, res, next) =>
  console.error(err) & res.status(500).send('An internal error occurred. Please try again later');

// #Standard error handler
export const standardErrorHandler = async (err, req, res, next) =>
  // #Double response checker for error
  res.headersSent
    ? console.error('[Error] Sent already:', err)
    : // #Handle error
    err instanceof Failure && err.type !== 'INTERNAL'
    ? console.error(err) & res.status(err.statusCode).json(err)
    : next(err);

export const normalErrorHandler = async (err, req, res, next) =>
  // #Handle error
  err instanceof Failure
    ? next(err)
    : err.name === 'UnauthorizedError'
    ? next(new Failure('Unauthorized', 401))
    : err.name === 'ValidationError'
    ? next(new Failure(err.message, 400))
    : next(err);

// #Standard success handler
export const standardSuccessHandler = async (req, res, next) =>
  // #Double response checker
  res.headersSent
    ? console.log('[Normal] Sent already:', req.x)
    : // #Handle response
    req.x && req.x instanceof Success
    ? console.log(req.x) & res.status(req.x.statusCode).json(req.x)
    : req.x
    ? next(
        new Failure(
          'Did not find properly formatted response data to send, instead got : ' +
            req.x.toString(),
          500,
          'INTERNAL'
        )
      )
    : next(new Failure(req.originalUrl + ' - endpoint call error', 500, 'INTERNAL'));
