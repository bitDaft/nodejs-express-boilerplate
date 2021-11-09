import crypto from "crypto";

export const randomTokenString = () => {
  return crypto.randomBytes(40).toString("hex");
};
