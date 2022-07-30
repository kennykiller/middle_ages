const Sequelize = require("sequelize");

import { sequelize } from "../util/database";

export const Film = sequelize.define("film", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(120),
    allowNull: false,
  },
  ageRestriction: {
    type: Sequelize.STRING(5),
    allowNull: false,
  },
  posterUrl: {
    type: Sequelize.TEXT,
  },
  description: {
    type: Sequelize.TEXT,
  },
  filmDuration: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  basePrice: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 500,
  },
  startDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  endDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});
