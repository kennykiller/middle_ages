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
    allowNull: false
  },
  filmDuration: {
      type: Sequelize.TIME,
      allowNull: false,
  },
});

module.exports = Session;
