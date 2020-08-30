import Joi from '@hapi/joi';
import { validateRequest } from 'globalMiddlewares';
import { RequestSchema } from 'types';

// Login
export type LoginRequest = RequestSchema<{
  email: string,
  password: string
}>;

export const loginSchema = validateRequest(Joi.object({
  email: Joi
    .string()
    .email()
    .required(),
  password: Joi
    .string()
    .required()
}));

// Logout
export type LogoutRequest = RequestSchema<{
  token: string
}>;

export const logoutSchema = validateRequest(Joi.object({
  token: Joi
    .string()
    .required()
}));

// Logout all
export const logoutAllSchema = validateRequest(Joi.object({
}));

// Set password
export type SetPasswordRequest = RequestSchema<{
  email: string,
  password: string
}>;

export const setPasswordSchema = validateRequest(Joi.object({
  password: Joi
    .string()
    .required()
}));

// Request password reset
export type RequestResetPasswordRequest = RequestSchema<{
  email: string,
  password: string
}>;

export const requestResetPasswordSchema = validateRequest(Joi.object({
  email: Joi
    .string()
    .email()
    .required()
}));

// Register third party
export type RegisterThirdPartyRequest = RequestSchema<{
  user: {
    name?: string,
    email: string,
    profilePicture?: string,
    googleId?: string
  }
}>;

export const registerThirdPartySchema = validateRequest(Joi.object({
  user: Joi
    .object({
      name: Joi
        .string(),
      email: Joi
        .string()
        .email()
        .required(),
      profilePicture: Joi
        .string(),
      googleId: Joi
        .string()
    })
}));
