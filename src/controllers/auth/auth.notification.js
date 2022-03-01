import { sendEmail } from '#utils/sendEmail';
import config from '#config';

export const sendRegistrationSuccessEmail = async (name, email, token) => {
  let verify_url = `${config.url}/verify?token=${token}`;
  const subject = `Welcome ${name}!!`;
  const html = `
    <h1>Registraion Successful</h1>
    <h4>Please click the button to verify your email address<h4>
    <br/>
    <button onclick="${verify_url}">Verify Now</button>
    <br />
    <small>If the button is not working, you can click <a href="${verify_url}">here</a></small>
  `;
  return sendEmail(email, subject, html);
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
  return sendEmail(email, subject, html);
};

export const sendForgotPasswordEmail = async (email, token) => {
  let reset_password_link = `${config.url}/reset-password?token=${token}`;
  const subject = `Password reset request!!`;
  const html = `
    <h1>Password reset request received</h1>
    <h4>Your request to reset your password has been received<h4>
    <br/>
    <h4>Please click the button below to reset your password<h4>
    <h4>Login to APP now to explore<h4>
    <br/>
    <button onclick="${reset_password_link}">Reset Password</button>
    <br />
    <small>If the button is not working, you can click <a href="${reset_password_link}">here</a></small>
  `;
  return sendEmail(email, subject, html);
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
  return sendEmail(email, subject, html);
};
