import { RequestHandler } from "express";
import { createHmac } from "crypto";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { ValidationError } from "express-validator";
import { User } from "../../models/user";
import { authConfig } from "../../auth.config";
import { ResetToken } from "../../models/reset_token";
import mailTransporter from "../../email";

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
    const isAdmin = name === authConfig.adminName;
    const user = await User.create({
      name,
      password: hashedPw,
      phone,
      email,
      isAdmin,
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
export const reset: RequestHandler = async (req, res, next) => {
  const { email } = req.body;
  if (email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    const existingToken = await ResetToken.findOne({
      where: { userId: user.id },
    });
    if (existingToken) {
      await ResetToken.destroy({ where: { id: existingToken.id } });
    }
    const resetToken = createHmac("sha256", authConfig.resetSecret)
      .update(email)
      .digest("hex");
    const hash = await bcrypt.hash(resetToken, 10);

    const expiryDate = new Date().setMilliseconds(60 * 60 * 1000);

    await ResetToken.create({
      userId: user.id,
      token: hash,
      expiryDate,
    });

    const link = `http://localhost:8080/passwordReset?token=${resetToken}&id=${user.id}`;
    mailTransporter.sendMail(email, "Запрос на сброс пароля", {
      name: user.name,
      link,
    });
  }
};
export const createNewPassword: RequestHandler = (req, res, next) => {};
