import Sequelize from "sequelize";
import bcrypt from "bcrypt";
import { sequelize } from "../util/database";
import { authConfig } from "../auth.config";

const { v4: uuidv4 } = require("uuid");
const RefreshToken = sequelize.define("refresh_token", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  expiryDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});
RefreshToken.createToken = async function (userId: number) {
  let expiredAt = new Date();
  expiredAt.setSeconds(
    expiredAt.getSeconds() + authConfig.jwtRefreshExpiration
  );
  let _token = uuidv4();
  let hashedToken = await bcrypt.hash(_token, 10);
  await this.create({
    token: hashedToken,
    userId,
    expiryDate: expiredAt.getTime(),
  });
  return _token;
};
RefreshToken.verifyExpiration = (token: { expiryDate: Date }) => {
  return token.expiryDate.getTime() < new Date().getTime();
};

export default RefreshToken;
