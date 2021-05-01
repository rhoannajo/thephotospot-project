const mysql = require('mysql2');


const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password:"64222420",
    database:"csc317db",
    connectionLimit: 50,
    debug: false, //dumps a lot of info to console if it's true
});

//database module. if anyone imports, 
//will export through pool
const promisePool = pool.promise();
module.exports = promisePool;