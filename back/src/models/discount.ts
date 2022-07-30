const Sequelize = require("sequelize");

import { sequelize } from "../util/database";

export const Discount = sequelize.define("discount", {
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
  discountPercentage: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});
