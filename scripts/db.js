mysql = require('mysql'); // Database connection

var connection = mysql.createConnection({
    host:   'localhost',
    user: 'root',
    password: 'johannw2004',
    database: 'db_sky',
    charset: 'utf8mb4',
    dateStrings: true
});

connection.connect();
module.exports = connection;
