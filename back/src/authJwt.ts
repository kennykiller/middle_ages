import jwt from "jsonwebtoken";
import { authConfig } from "./auth.config";
import { RequestHandler } from "express";

const { TokenExpiredError } = jwt;
const catchError = (err: jwt.VerifyErrors, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Токен просрочен" });
  }
  return res.sendStatus(401).send({ message: "Не авторизован!" });
};
export const verifyToken: RequestHandler = (req, res, next) => {
  let token = req.headers["x-access-token"] as string;
  if (!token) {
    return res.status(403).send({ message: "Нет токена" });
  }
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};
