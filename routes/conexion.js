const mysql = require('mysql2/promise')
const dotenv = require('dotenv').config();

var connection = mysql.createConnection({
    host: process.env.BD_HOST,
    user: process.env.BD_USER,
    database: process.env.BD_BASE_DATOS,
    password: process.env.BD_PASSWORD})

module.exports = connection
