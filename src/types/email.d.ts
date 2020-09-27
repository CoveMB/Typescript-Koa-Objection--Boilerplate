import { Context } from 'koa';
import { User } from 'models';
import { ReturnToken } from 'types';

export type SendTokenEmail = ((
  ctx: Context,
  { email }: User,
  { token }: ReturnToken
) => Promise<void>);

export type TokenEmailClient = {
  sendConfirmationEmail: SendTokenEmail,
  sendResetPasswordEmail: SendTokenEmail
};
