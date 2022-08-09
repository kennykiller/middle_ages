const Sequelize = require("sequelize");

export const sequelize = new Sequelize(
  "middle-ages",
  "developer",
  "dev-secret",
  {
    dialect: "mysql",
    host: "mysql",
  }
);
