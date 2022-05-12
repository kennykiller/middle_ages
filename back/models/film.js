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
  description: {
    type: Sequelize.TEXT
  },
  filmDuration: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  startDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  endDate: {
    type: Sequelize.DATE,
    allowNull: false
  }
});

module.exports = Film;
