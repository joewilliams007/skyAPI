mysql = require('mysql'); // Database connection

/*var connection = mysql.createConnection({
    host:   'localhost',
    user: 'sky',
    password: 'PASSWORD',
    database: 'db_sky',
    charset: 'utf8mb4',
    dateStrings: true
});*/

var connection = mysql.createPool({
  connectionLimit : 10,
  host:   'localhost',
    user: 'sky',
    password: 'PASSWORD',
    database: 'db_sky',
    charset: 'utf8mb4',
    dateStrings: true
});

connection.connect();
module.exports = connection;
