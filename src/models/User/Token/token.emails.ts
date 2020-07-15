import { MailService } from '@sendgrid/mail';
import sgMailClient from 'config/emails';
import { errorEvent } from 'config/errors/error.event';
import { EmailNotSentError } from 'config/errors/error.types';
import { clientUrl, emailFrom } from 'config/variables';
import { Context } from 'koa';
import { User } from 'models';
import { TokenEmailClient } from 'types';

const sender = (emailClient: MailService): TokenEmailClient => ({
  async sendConfirmationEmail(
    ctx: Context,
    { email }: User,
    { token }: ReturnToken
  ): Promise<void> {

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
  async sendResetPasswordEmail(
    ctx: Context,
    { email }: User,
    { token }: ReturnToken
  ): Promise<void> {

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

const { sendConfirmationEmail, sendResetPasswordEmail } = sender(sgMailClient);

export { sendConfirmationEmail, sendResetPasswordEmail };
