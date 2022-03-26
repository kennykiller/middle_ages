const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Film = sequelize.define('film', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ageRestriction: {
    type: Sequelize.STRING,
    allowNull: false
  },
  posterUrl: {
    type: Sequelize.TEXT
  },
  startDate: {
    type: Sequelize.STRING,
    allowNull: false
  },
  endDate: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Film;
