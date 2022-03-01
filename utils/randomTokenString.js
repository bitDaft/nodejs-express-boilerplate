import crypto from "crypto";

export const randomToken = (length = 40) => {
  return crypto.randomBytes(length).toString("hex");
};
