const Sequelize = require("sequelize");

import { sequelize } from "../util/database";

export const Seat = sequelize.define("seat", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  number: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  orderId: {
    type: Sequelize.INTEGER,
  },
  sessionId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});
