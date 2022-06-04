const Sequelize = require("sequelize");

import { sequelize } from "../util/database";
export const FilmGenres = sequelize.define("film_genres", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  filmId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  genreId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});
