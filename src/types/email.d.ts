import { User } from 'models';
import { ReturnToken } from 'types';
import { Context } from 'koa';

export type SendTokenEmail = ((
  ctx: Context,
  { email }: User,
  { token }: ReturnToken
) => Promise<void>);

export type TokenEmailClient = {
  sendConfirmationEmail: SendTokenEmail,
  sendResetPasswordEmail: SendTokenEmail
};
