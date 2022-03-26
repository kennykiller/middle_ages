const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
//   userId: {
//     type: Sequelize.INTEGER,
//   },
//   paymentStatusId: {
//     type: Sequelize.INTEGER,
//   },
//   filmId: {
//     type: Sequelize.INTEGER,
//   },
});

module.exports = Order;
