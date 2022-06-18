import { authConfig } from "../../auth.config";
import { User } from "../../models/user";
import RefreshToken from "../../models/refresh_token";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { RequestHandler } from "express";

interface refreshTokenInterface {
  id: number;
  token: string;
  expiryDate: Date;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export const signin: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body?.email,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "Email не найден" });
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body?.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(422).send({
        accessToken: null,
        message: "Неверный пароль",
      });
    }
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.jwtExpiration,
    });
    let refreshToken = await RefreshToken.createToken(user.id);
    if (user.isAdmin) {
      res.status(200).send({
        id: user.id,
        isAdmin: user.isAdmin,
        name: user.name,
        accessToken: token,
        refreshToken: refreshToken,
      });
    } else {
      res.status(200).send({
        id: user.id,
        name: user.name,
        accessToken: token,
        refreshToken: refreshToken,
      });
    }
  } catch (e) {
    return res.status(500).send({ message: e });
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  const { refreshToken: requestToken, userId } = req.body;
  if (!requestToken) {
    return res.status(403).json({ message: "Токен не предоставлен" });
  }
  if (!userId) {
    return res
      .status(403)
      .json({ message: "Идентификатор пользователя не предоставлен" });
  }
  try {
    let hashedTokenRecord: refreshTokenInterface = await RefreshToken.findOne({
      where: {
        userId: userId,
      },
    });
    const refreshTokenExists = await bcrypt.compare(
      requestToken,
      hashedTokenRecord.token
    );
    if (!refreshTokenExists) {
      res.status(403).json({ message: "Токен не найден в базе данных" });
      return;
    }
    if (RefreshToken.verifyExpiration(hashedTokenRecord)) {
      await RefreshToken.destroy({
        where: {
          id: hashedTokenRecord.id,
        },
      });
      res.status(403).json({
        message: "Рефреш-токен устарел",
      });
      return;
    } else {
      await RefreshToken.destroy({
        where: {
          id: hashedTokenRecord.id,
        },
      });
    }
    const user = await User.findOne({
      where: { id: hashedTokenRecord.userId },
    });

    let newAccessToken = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.jwtExpiration,
    });
    const newRefreshToken = await RefreshToken.createToken(user);
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (e) {
    return res.status(500).send({ message: e, details: "Серверная ошибка" });
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  const id = req.body.id;
  await RefreshToken.destroy({
    where: {
      userId: id,
    },
  });

  res.send({
    message: "success",
  });
};
