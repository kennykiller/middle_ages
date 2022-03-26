const Sequelize = require('sequelize');

const sequelize = new Sequelize('dota-cinema', 'root', '!DotaCinema2012', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;