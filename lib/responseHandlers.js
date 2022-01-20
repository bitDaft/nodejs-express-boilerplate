import { Failure, Success } from "#lib/responseHelpers";

// #Catch all error handler(fallback)
export const finalErrorHandler = (err, req, res, next) =>
  console.error(err) &
  res.status(500).send("An internal error occurred. Please try again later");

// #Standard error handler
export const standardErrorHandler = (err, req, res, next) =>
  // #Double response checker for error
  res.headersSent
    ? console.error("[Error] Sent already:", err)
    : // #Handle error
    err instanceof Failure && err.type && err.type !== "INTERNAL"
    ? console.error(err) & res.status(err.statusCode).json(err)
    : next(err);

// #Standard success handler
export const standardSuccessHandler = (req, res, next) =>
  // #Double response checker
  res.headersSent
    ? console.log("[Normal] Sent already:", req.x)
    : // #Handle response
    req.x instanceof Success && req.x
    ? res.status(req.x.statusCode).json(req.x)
    : req.x
    ? next(
        new Failure(
          "Did not find properly formatted response data to send, instead got : " +
            req.x.toString(),
          500,
          "INTERNAL"
        )
      )
    : next(new Failure("SUCCESS send error", 500, "INTERNAL"));
