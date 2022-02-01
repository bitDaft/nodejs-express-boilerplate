import crypto from "crypto";

export const randomToken = () => {
  return crypto.randomBytes(40).toString("hex");
};
