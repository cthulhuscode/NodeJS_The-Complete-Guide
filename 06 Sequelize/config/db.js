// -- Sequelize --

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        dialect: "mysql",
        host: process.env.DB_HOST,
    }
);

module.exports = sequelize;

/*
// -- MySQL --

const mysql = require("mysql2");
// Pool for having a persistent connection
// and avoid to be opening and closing the connection

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
});

module.exports = pool.promise();
*/
