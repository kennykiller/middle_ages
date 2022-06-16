import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { ValidationError } from "express-validator";
import { User } from "../../models/user";

interface extendedValidationError extends Error {
  data?: ValidationError[];
  statusCode?: number;
  success?: boolean;
}

export const createUser: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: extendedValidationError = new Error("Валидация не пройдена.");
    error.statusCode = 422;
    error.data = errors.array();
    error.success = false;
    return res.send(error);
  }
  try {
    const { email, password, phone, name } = req.body;
    const hashedPw = await bcrypt.hash(password, 12);
    console.log(email, password, phone, name);
    const user = await User.create({
      name,
      password: hashedPw,
      phone,
      email,
    });
    res.status(201).json({
      success: true,
      message: "Пользователь успешно зарегистрирован",
      user,
    });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
export const reset: RequestHandler = (req, res, next) => {};
export const createNewPassword: RequestHandler = (req, res, next) => {};
