const Sequelize = require("sequelize");

import { sequelize } from "../util/database";

export const Genre = sequelize.define("genre", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
});
