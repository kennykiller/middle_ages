const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Session = sequelize.define("session", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  filmStart: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  seatsAvailable: {
    type: Sequelize.INTEGER,
    default: 200,
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
    default: 500,
  },
});

module.exports = Session;
