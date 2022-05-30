import { Router } from "express";
import { check, body } from "express-validator/check";
import {
  createUser,
  createNewPassword,
  logout,
  reset,
} from "../controllers/auth/signupController";
import { signin, refreshToken } from "../controllers/auth/loginController";
import { verifyToken } from "../authJwt";
import User from "../../models/user";

const router = Router();

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Пожалуйста, введите валидный email")
      .custom(async (value, { req }) => {
        try {
          const user = await User.findByOne({ where: { email: value } });
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
  verifyToken,
  createUser
);

router.post("/refreshtoken", refreshToken);

router.post("/logout", logout);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Пожалуйста, введите валидный email"),
    body("password", "Пароль должен быть не менее 6 символов").isLength({
      min: 6,
    }),
  ],
  signin
);

router.post("/reset", reset);

router.post(
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

module.exports = router;
