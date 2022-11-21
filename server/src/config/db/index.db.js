const mysql = require('mysql2/promise');
const dotenv = require("dotenv");
dotenv.config();

async function query(sql, params) {
    // const connection = await mysql.createConnection({
    //     host: "localhost",
    //     user: "root",
    //     password: "",
    //     database: "discode",
    //     dateStrings: true,
    // });

    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PWD,
        database: process.env.DATABASE_NAME,
        dateStrings: true,
    });

    if (connection) {
        //console.log("Connected database");
    }
    const [rows, fields] = await connection.execute(sql, params);
    return rows;
}

module.exports = {
    query
};