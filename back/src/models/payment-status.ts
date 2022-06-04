const Sequelize = require("sequelize");

import { sequelize } from "../util/database";

export const PaymentStatus = sequelize.define("status", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
