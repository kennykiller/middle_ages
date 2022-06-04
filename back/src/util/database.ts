const Sequelize = require("sequelize");

export const sequelize = new Sequelize(
  "dota-cinema",
  "root",
  "!DotaCinema2012",
  {
    dialect: "mysql",
    host: "localhost",
  }
);
