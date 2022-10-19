const mysql = require('mysql2/promise');
const dotenv = require("dotenv");
dotenv.config();

async function query(sql, params) {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "discode",
    });

    //const connection = await mysql.createConnection({
    //  host: process.env.DATABASE_HOST,
    //  user: process.env.DATABASE_USER, 
    //  password: process.env.DATABASE_PWD,
    //  database: process.env.DATABASE_NAME,
    //});

    if (connection) {
        console.log("Connected database");
    }
    const [rows, fields] = await connection.execute(sql, params);
    return rows;
}

module.exports = {
    query
};