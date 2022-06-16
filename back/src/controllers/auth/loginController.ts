import { authConfig } from "../../auth.config";
import { User } from "../../models/user";
import RefreshToken from "../../models/refresh-token";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { RequestHandler } from "express";

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
    let refreshToken = await RefreshToken.createToken(user);
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 3 * 60 * 1000,
    // });
    res.status(200).send({
      id: user.id,
      name: user.name,
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (e) {
    return res.status(500).send({ message: e });
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Токен не предоставлен" });
  }
  try {
    let refreshToken = await RefreshToken.findOne({
      where: {
        token: requestToken,
      },
    });
    if (!refreshToken) {
      res.status(403).json({ message: "Токен не найден в базе данных" });
      return;
    }
    if (RefreshToken.verifyExpiration(refreshToken)) {
      await RefreshToken.destroy({
        where: {
          id: refreshToken.id,
        },
      });
      res.status(403).json({
        message: "Рефреш-токен устарел",
      });
      return;
    } else {
      await RefreshToken.destroy({
        where: {
          id: refreshToken.id,
        },
      });
    }
    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.jwtExpiration,
    });
    const newRefreshToken = await RefreshToken.createToken(user);
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (e) {
    return res.status(500).send({ message: e });
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
