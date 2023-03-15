const mysql = require("mysql2");
const pool = mysql.createPool({
    host: "192.168.21.14", // 阜位
    user: "studioa", // 使用者
    password: "studioa", // 密碼
    database: "studioa", // 連到哪個資料庫
    waitForConnections: true, // 等待連線
    connectionLimit: 5, // 最多可同時連線數(為省效能而設計的)
    queueLimit: 0, // 是否限定排隊人數，0是不限制
});
module.exports = pool.promise();
