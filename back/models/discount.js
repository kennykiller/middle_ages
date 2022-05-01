const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Discount = sequelize.define('discount', {
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
    discountPercentage: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
  });
  
  module.exports = Discount;