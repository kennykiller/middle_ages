const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  amtVisits: {
    type: Sequelize.INTEGER
  }
}, {
  instanceMethods: {
    generateHash(password) {
      return bcrypt.hash(password, bcrypt.genSaltSync(8));
  },
    validPassword(password) {
      return bcrypt.compare(password, this.password);
  }
  }
});

module.exports = User;