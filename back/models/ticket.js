const { STRING, INTEGER } = require("sequelize");

const sequelize = require("../util/database");

const Ticket = sequelize.define("ticket", {
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

module.exports = Ticket;
