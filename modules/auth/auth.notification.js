import config from '#config';
import mailQueue from '#queue/mail';

export const sendRegistrationSuccessEmail = async (name, email, token) => {
  let verifyUrl = `${config.url}/auth/verify?token=${token}`;
  const subject = `Welcome ${name}!!`;
  const html = `
    <h1>Registraion Successful</h1>
    <h4>Please click the button to verify your email address<h4>
    <br/>
    <button onclick="${verifyUrl}">Verify Now</button>
    <br />
    <small>If the button is not working, you can click <a href="${verifyUrl}">here</a></small>
  `;
  return await mailQueue.add('registration', { from: config.smtpFrom, to: email, subject, html });
};

export const sendVerificationSuccessEmail = async (email) => {
  const subject = `You are now verified!!`;
  const html = `
    <h1>Verification Successful</h1>
    <h4>You have been successfully verified<h4>
    <br/>
    <h4>Login to APP now to explore<h4>
    <br/>
  `;
  return await mailQueue.add('verification', { from: config.smtpFrom, to: email, subject, html });
};

export const sendForgotPasswordEmail = async (email, token) => {
  let resetPasswordLink = `${config.url}/auth/reset-password?token=${token}`;
  const subject = `Password reset request!!`;
  const html = `
    <h1>Password reset request received</h1>
    <h4>Your request to reset your password has been received<h4>
    <br/>
    <h4>Please click the button below to reset your password<h4>
    <h4>Login to APP now to explore<h4>
    <br/>
    <button onclick="${resetPasswordLink}">Reset Password</button>
    <br />
    <small>If the button is not working, you can click <a href="${resetPasswordLink}">here</a></small>
  `;
  return await mailQueue.add('forgotPassword', { from: config.smtpFrom, to: email, subject, html });
};

export const sendPasswordResetSuccessEmail = async (email) => {
  const subject = `Password reset succesfully!!`;
  const html = `
    <h1>Password reset successful</h1>
    <h4>You have successfully changed your password<h4>
    <br/>
    <h4>Login to APP now to explore<h4>
    <br/>
  `;
  return await mailQueue.add('passwordReset', { from: config.smtpFrom, to: email, subject, html });
};
