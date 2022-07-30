const Sequelize = require("sequelize");

import { sequelize } from "../util/database";

export const Ticket = sequelize.define("ticket", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  totalPrice: {
    type: Sequelize.DECIMAL(6, 2),
    allowNull: false,
  },
  seatId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  orderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});
