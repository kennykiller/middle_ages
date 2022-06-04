const { STRING, INTEGER } = require("sequelize");

import { sequelize } from "../util/database";

export const Ticket = sequelize.define("ticket", {
  id: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  totalPrice: {
    type: INTEGER,
    allowNull: false,
  },
  seat: {
    type: STRING,
    allowNull: false,
  },
});
