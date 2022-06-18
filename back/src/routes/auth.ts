import { Router } from "express";
import { check, body } from "express-validator/check";
import {
  createUser,
  createNewPassword,
  reset,
} from "../controllers/auth/signupController";
import {
  signin,
  refreshToken,
  logout,
} from "../controllers/auth/loginController";
import { User } from "../models/user";

const authRouter = Router();

authRouter.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Пожалуйста, введите валидный email")
      .custom(async (value, { req }) => {
        try {
          const user = await User.findOne({ where: { email: value } });
          if (user) {
            return Promise.reject("E-Mail уже существует!");
          }
        } catch (e) {
          console.log(e);
        }
      })
      .normalizeEmail(),
    body("password", "Пароль должен быть не менее 6 символов").isLength({
      min: 6,
    }),
    body("passwordConfirmation").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Пароли не совпадают!");
      }
      return true;
    }),
  ],
  createUser
);

authRouter.post("/refreshtoken", refreshToken);

authRouter.post("/logout", logout);

authRouter.post(
  "/login",
  [
    check("email").isEmail().withMessage("Пожалуйста, введите валидный email"),
    body("password", "Пароль должен быть не менее 6 символов").isLength({
      min: 6,
    }),
  ],
  signin
);

authRouter.post("/reset", reset);

authRouter.post(
  "/new-password",
  [
    body("password", "Пароль должен быть не менее 6 символов").isLength({
      min: 6,
    }),
    body("passwordConfirmation").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Пароли не совпадают!");
      }
      return true;
    }),
  ],
  createNewPassword
);

export default authRouter;
