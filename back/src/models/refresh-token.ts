import Sequelize from "sequelize";

import { sequelize } from "../util/database";
import { authConfig } from "../auth.config";
const { v4: uuidv4 } = require("uuid");
const RefreshToken = sequelize.define("refresh_token", {
  token: {
    type: Sequelize.STRING,
  },
  expiryDate: {
    type: Sequelize.DATE,
  },
  userId: {
    type: Sequelize.INTEGER,
  },
});
RefreshToken.createToken = async function (user) {
  let expiredAt = new Date();
  expiredAt.setSeconds(
    expiredAt.getSeconds() + authConfig.jwtRefreshExpiration
  );
  let _token = uuidv4();
  let refreshToken = await this.create({
    token: _token,
    userId: user.id,
    expiryDate: expiredAt.getTime(),
  });
  return refreshToken.token;
};
RefreshToken.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
};

export default RefreshToken;
