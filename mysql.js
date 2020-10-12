const mysql = require('mysql');
//o nodemon vai passar as variaveis de ambiente definido no arquivo nodemon.json
const pool = mysql.createPool({
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT
});

exports.pool = pool;