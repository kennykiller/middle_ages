import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { ValidationError } from "express-validator";

interface extendedValidationError extends Error {
  data?: ValidationError[];
  statusCode?: number;
}

export const createUser: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: extendedValidationError = new Error("Валидация не пройдена.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
};
export const login: RequestHandler = (req, res, next) => {};
export const logout: RequestHandler = (req, res, next) => {};
export const reset: RequestHandler = (req, res, next) => {};
export const createNewPassword: RequestHandler = (req, res, next) => {};
