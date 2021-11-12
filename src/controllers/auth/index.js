import { default as jwt } from "jsonwebtoken";

import { Failure } from "#utils/responseHelpers";
import { easyCatch } from "#utils/easyCatch";
import config from "#config";

import {
  sendRegistrationSuccessEmail,
  sendVerificationSuccessEmail,
  sendPasswordResetSuccessEmail,
  sendForgotPasswordEmail,
} from "./notification.js";
import { basicUser } from "./util.js";
import {
  getUserWithEmail,
  getUserWithEmailAndValid,
  deleteRefreshTokenInstance,
  createRefreshTokenforUser,
  createUser,
  deleteUserInstance,
  getUserWithVerificationToken,
  getRefreshTokenWithToken,
  verifyUserInstance,
  resetUserInstance,
  clearResetUserInstance,
  getUserWithResetToken,
  resetUserPasswordInstance,
} from "./db.js";

export const loginUser = async (email, password) => {
  if (typeof email !== "string" && !email) {
    throw new Failure("Invalid Email given");
  }
  if (typeof password !== "string" && !password) {
    throw new Failure("Invalid Password given");
  }
  let users = await getUserWithEmailAndValid(email, true).catch(
    easyCatch("user fetch", "Unable to log in user")
  );

  if (
    !users.length ||
    !users[0].isVerified ||
    !users[0].validatePassword(password)
  ) {
    throw new Failure("Invalid Email or Password", 401, "INVALID");
  }
  let user = users[0];

  let jwtToken = jwt.sign({ sub: user.id, id: user.id }, config.JWT_SECRET, {
    expiresIn: "15m",
  });

  if (user.refresh_token) {
    await deleteRefreshTokenInstance(user.refresh_token).catch(
      easyCatch("delete refresh token", "Unable to log in user")
    );
  }

  let refresh_token = await createRefreshTokenforUser(user.id).catch(
    easyCatch("create refresh token", "Unable to log in user")
  );

  return {
    user: basicUser(user),
    role: user.role,
    access_token: jwtToken,
    refresh_token: refresh_token.refresh_token,
  };
};

export const registerUser = async (name, email, password) => {
  if (typeof name !== "string" && !name) {
    throw new Failure("Invalid Name given");
  }
  if (typeof email !== "string" && !email) {
    throw new Failure("Invalid Email given");
  }
  if (typeof password !== "string" && !password) {
    throw new Failure("Invalid Password given");
  }

  let password_re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

  let search_index = password.search(password_re);
  // #throw error if search index is anything other than 0
  if (search_index) {
    throw new Failure(
      "Password must have a minimum length of 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"
    );
  }

  let users = await getUserWithEmail(email).catch(
    easyCatch("user fetch", "Unable to register user")
  );

  let user = null;
  if (users.length) {
    throw new Failure("Email already registered", 400, "EXISTS");
  } else {
    user = await createUser(name, email, password).catch(
      easyCatch("user create", "Unable to register user")
    );
  }

  await sendRegistrationSuccessEmail(
    name,
    email,
    user.verification_token
  ).catch(async (err) => {
    await deleteUserInstance(user).catch(
      easyCatch("user delete", "Unable to register user")
    );
    await easyCatch("email send", "Unable to register user")(err);
  });

  return user;
};

export const verifyUser = async (token) => {
  if (typeof token !== "string" && !token) {
    throw new Failure("Invalid Token given");
  }

  let users = await getUserWithVerificationToken(token).catch(
    easyCatch("user fetch", "Unable to verify user")
  );

  if (!users.length) throw new Failure("Invalid Token given");

  let user = users[0];

  if (user.isVerified) {
    throw new Failure("User has already been verified");
  }

  if (new Date(user.verification_expiry).getTime() < Date.now()) {
    await deleteUserInstance(user).catch(
      easyCatch("user delete", "Unable to verify user")
    );
    throw new Failure(
      "Verification time has expired. please register again",
      400,
      "EXPIRED"
    );
  }

  await verifyUserInstance(user).catch(
    easyCatch("user verification", "Unable to verify user")
  );

  sendVerificationSuccessEmail(user.email);

  return user;
};

export const refreshToken = async (token_string) => {
  if (typeof token_string !== "string" && !token_string) {
    throw new Failure("Invalid Refresh token given");
  }

  let tokens = await getRefreshTokenWithToken(token_string).catch(
    easyCatch("token fetch", "Unable to refresh token")
  );

  if (!tokens.length) {
    throw new Failure("Invalid Refresh token given", 400, "INVALID");
  }
  let token = tokens[0];

  if (!token.isValid || !token.user) {
    await deleteRefreshTokenInstance(token).catch(
      easyCatch("invalid token delete", "Unable to refresh token")
    );
    throw new Failure(
      "Invalid or Expired Refresh token. please login again",
      400,
      "EXPIRED"
    );
  }

  let user = token.user;

  let jwtToken = jwt.sign({ sub: user.id, id: user.id }, config.JWT_SECRET, {
    expiresIn: "15m",
  });

  await deleteRefreshTokenInstance(token).catch(
    easyCatch("valid token delete", "Unable to refresh token")
  );

  let refresh_token = await createRefreshTokenforUser(user.id).catch(
    easyCatch("refresh token create", "Unable to refresh token")
  );

  return {
    access_token: jwtToken,
    refresh_token: refresh_token.refresh_token,
  };
};

export const revokeToken = async (token_string) => {
  if (typeof token_string !== "string" && !token_string) {
    throw new Failure("Invalid Refresh token given");
  }

  let tokens = await getRefreshTokenWithToken(token_string).catch(
    easyCatch("token fetch", "Unable to revoke token")
  );

  if (!tokens.length) {
    throw new Failure("Invalid Refresh token given", 400, "INVALID");
  }
  let token = tokens[0];

  if (!token.isValid || !token.user) {
    await deleteRefreshTokenInstance(token).catch(
      easyCatch("invalid token delete", "Unable to revoke token")
    );
    return true;
  }

  let user = token.user;

  await deleteRefreshTokenInstance(token).catch(
    easyCatch("valid token delete", "Unable to revoke token")
  );

  return true;
};

export const forgotPassword = async (email) => {
  if (typeof email !== "string" && !email) {
    throw new Failure("Invalid Email given");
  }

  let users = await getUserWithEmailAndValid(email, true).catch(
    easyCatch("user fetch", "Unable to reset password")
  );

  if (!users.length) {
    return true;
  }
  
  let user = users[0];

  await resetUserInstance(user).catch(
    easyCatch("user reset", "Unable to reset password")
  );

  await sendForgotPasswordEmail(email, user.reset_token).catch(async (err) => {
    await clearResetUserInstance(user).catch(
      easyCatch("user reset clear", "Unable to reset password")
    );
    await easyCatch("email sending", "Unable to reset password for user")(err);
  });

  return true;
};

export const validateResetToken = async (token) => {
  if (typeof token !== "string" && !token) {
    throw new Failure("Invalid Reset token given");
  }

  let users = await getUserWithResetToken(token).catch(
    easyCatch("user reset fetch", "Unable to reset password")
  );

  if (!users.length) {
    throw new Failure("Invalid token");
  }

  return users[0];
};

export const resetPassword = async (token, password) => {
  if (typeof token !== "string" && !token) {
    throw new Failure("Invalid Reset token given");
  }
  if (typeof password !== "string" && !password) {
    throw new Failure("Invalid Reset password given");
  }

  let password_re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

  let search_index = password.search(password_re);
  // #throw error if search index is anything other than 0
  if (search_index) {
    throw new Failure(
      "Password must have a minimum length of 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"
    );
  }

  let user = await validateResetToken(token);

  resetUserPasswordInstance(user, password).catch(
    easyCatch("user reset password", "Unable to reset password")
  );

  sendPasswordResetSuccessEmail(user.email);
  return true;
};
