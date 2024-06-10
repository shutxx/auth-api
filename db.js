const sequelize = require('sequelize');

const db = new sequelize({
  dialect: 'sqlite',
  storage: './auth.sqlite',
});

module.exports = db;
