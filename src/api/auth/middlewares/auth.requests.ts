import Joi from 'joi';
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

// Register
// Create and Update schema
export type RegisterRequest = RequestSchema<{
  email: string
}>;

// Define schema to validate request body
export const register = validateRequest(Joi.object({
  email: Joi
    .string()
    .email()
    .required()
}));

// Logout
export type LogoutRequest = RequestSchema<{
  token?: string
}>;

export const logoutSchema = validateRequest(Joi.object({
  token: Joi
    .string()
}));

// Logout all
export const logoutAllSchema = validateRequest(Joi.object({
}));

// Set password
export type SetPasswordRequest = RequestSchema<{
  password: string,
  token: string
}>;

export const setPasswordSchema = validateRequest(Joi.object({
  password: Joi
    .string()
    .required(),
  token: Joi
    .string()
    .required()
}));

// Request password reset
export type RequestResetPasswordRequest = RequestSchema<{
  email: string
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
