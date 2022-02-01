import { Failure } from "#lib/responseHelpers";

export const easyCatch = (fail_message) => (during_message) => async (err) => {
  console.error(during_message);
  console.error(err);
  let error = fail_message + ". Please try again later.";
  if (err.name === "ValidationError") {
    error = err.message;
  }
  throw new Failure(error, 500, "ERROR");
};
