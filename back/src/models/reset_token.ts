import Sequelize from "sequelize";
import { sequelize } from "../util/database";

export const ResetToken = sequelize.define("reset_token", {
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
