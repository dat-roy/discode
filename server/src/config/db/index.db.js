const mysql = require('mysql2');
const dotenv = require("dotenv");
dotenv.config();

// async function query(sql, params) {
//     const connection = await mysql.createConnection({
//         host: process.env.DATABASE_HOST,
//         user: process.env.DATABASE_USER,
//         password: process.env.DATABASE_PWD,
//         database: process.env.DATABASE_NAME,
//         dateStrings: true,
//     });

//     if (connection) {
//         //console.log("Connected database");
//     }
//     const [rows, fields] = await connection.execute(sql, params);
//     return rows;
// }

let pool;

const poolUtils = {
    getPool: function () {
        if (pool) return pool;
        pool = mysql.createPool({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PWD,
            database: process.env.DATABASE_NAME,
            dateStrings: true,
        })
        return pool;
    }
}

async function query(sql, params) {
    const poolPromise = (poolUtils.getPool()).promise();
    const [rows, fields] = await poolPromise.query(sql);
    return rows;
}

module.exports = {
    query
};