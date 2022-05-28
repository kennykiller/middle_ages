import { Router } from "express";
import { check, body } from "express-validator/check";
import {
  createUser,
  createNewPassword,
  login,
  logout,
  reset,
} from "../controllers/auth/signupController";
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
  createUser
);

router.post("/logout", logout);

router.post("/reset", login);

router.post("/reset", reset);

router.post("/new-password", createNewPassword);

module.exports = router;
