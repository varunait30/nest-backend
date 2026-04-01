import { StringValue } from 'ms';
export const MESSAGES = {
  USER_CREATED: 'User registered successfully',
  USER_EXISTS: 'Email already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_PASSWORD: 'Invalid password',
  LOGIN_SUCCESS: 'Login successful',
};



export const JWT_CONSTANTS = {
  SECRET: 'mySecretKey',
  EXPIRES_IN: '1d' as StringValue,
};