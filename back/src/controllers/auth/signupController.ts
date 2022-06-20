import { RequestHandler } from "express";
import { createHmac } from "crypto";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { ValidationError } from "express-validator";
import { User } from "../../models/user";
import { authConfig } from "../../auth.config";
import { ResetToken } from "../../models/reset_token";
import EmailHandler from "../../email";

interface extendedValidationError extends Error {
  data?: ValidationError[];
  statusCode?: number;
  success?: boolean;
}

interface resetPasswordBody {
  token: string;
  userId: number;
  password: string;
  passwordConfirmation: string;
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
    const emailHandler = new EmailHandler(email, "welcome", name);
    emailHandler.sendMail();
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
export const resetLinkCreate: RequestHandler = async (req, res, next) => {
  const { email } = req.body as { email: string };
  if (email) {
    try {
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

      const link = `http://localhost:8080/password-reset?token=${resetToken}&id=${user.id}`;
      const emailHandler = new EmailHandler(email, "reset", user.name, link);
      emailHandler.sendMail();
      res.status(200).json({
        success: true,
        message: "Ссылка успешно отправлена на почту",
      });
    } catch (e) {
      if (!e.statusCode) {
        e.statusCode = 500;
      }
      next(e);
    }
  }
};
export const resetPassword: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: extendedValidationError = new Error("Валидация не пройдена.");
    error.statusCode = 422;
    error.data = errors.array();
    error.success = false;
    return res.send(error);
  }
  const { userId, password, passwordConfirmation, token } =
    req.body as resetPasswordBody;
  try {
    const passwordResetToken = await ResetToken.findOne({
      where: {
        [Op.and]: [
          {
            userId,
            expiryDate: { [Op.gt]: new Date() },
          },
        ],
      },
    });
    if (!passwordResetToken) {
      throw new Error("Неверный либо просроченный токен сброса пароля!");
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      throw new Error("Неверный либо просроченный токен сброса пароля!");
    }
    const hashedPw = await bcrypt.hash(password, 12);
    const user = await User.findByPk(userId);
    user.password = hashedPw;
    await user.save();
    await ResetToken.destroy({ where: { userId } });
    res.status(202).json({
      success: true,
      message: "Пароль успешно изменен.",
    });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
