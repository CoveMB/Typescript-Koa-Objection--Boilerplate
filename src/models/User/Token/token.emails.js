const { EmailNotSentError } = require('config/errors/error.types');
const { errorEvent } = require('config/errors/error.event');
const { emailFrom, clientUrl } = require('config/variables');
const sgMail = require('config/emails');

const sender = emailClient => ({
  async sendConfirmationEmail(ctx, { email }, { token }) {

    try {

      await emailClient.send({
        to     : email,
        from   : emailFrom,
        subject: 'Thanks for joining in!',
        html   : `
        <h2>Welcome, please confirm your email</h2>
        <a href="${clientUrl}/set-password?token=${token}">click here</a>`
      });

    } catch (error) {

      // Since the email is sent asynchronously we just emit an error but dont throw it
      ctx.app.emit(errorEvent, new EmailNotSentError(error), ctx);

    }

  },
  async sendResetPasswordEmail(ctx, { email }, { token }) {

    try {

      await emailClient.send({
        to     : email,
        from   : emailFrom,
        subject: 'Reset your password',
        html   : `
        <h2>Reset your password</h2>
        <a href="${clientUrl}/set-password?token=${token}">click here</a>`,
      });

    } catch (error) {

      // Since the email is sent asynchronously we just emit an error but dont throw it
      ctx.app.emit(errorEvent, new EmailNotSentError(error), ctx);

    }

  }
});

const sendEmails = sender(sgMail);

module.exports = sendEmails;
