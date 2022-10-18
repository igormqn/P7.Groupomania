require('dotenv').config()
const { Sequelize } = require('sequelize');
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const database = process.env.DATABASE
const db = new Sequelize(
  {
    dialect: "mysql",
    host: "127.0.0.1",        
    username: username,
    password: password,
    database: database    
  },
);
db.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = db;
