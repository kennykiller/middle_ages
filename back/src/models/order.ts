const Sequelize = require("sequelize");

import { sequelize } from "../util/database";

export const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  statusId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  discountId: {
    type: Sequelize.INTEGER,
  },
});
