const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  // host: "http://192.168.10.56",
  host: process.env.HOST || "tripy_mysql",
  port: 3306,
  user: "root",
  password: "1234", // 본인 MySQL 비밀번호로 변경
  database: "trip-db",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
