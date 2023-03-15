// 判斷以哪個env檔的設定啟動
if (process.argv[2] && process.argv[2] === "production") {
    require("dotenv").config({
        path: "./production.env",
    });
} else {
    require("dotenv").config({
        path: "./dev.env",
    });
}

// 引入套件
const express = require("express");
const jwt = require("jsonwebtoken");
const days = require("dayjs");
const cors = require("cors");

// 引入db連線模組
const db = require("./modules/db_connect");

// 使用express
const app = express();

// top-level middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const corsOption = {
    credentials: true,
    origin: function (origin, cb) {
        console.log({ origin }); // 如果不是透過ajax是拿不到origin的
        cb(null, true);
    },
};
app.use(cors(corsOption));

// 自訂義middleware
app.use((req, res, next) => {
    // 時間轉換function
    res.locals.dayFormat = (date) => {
        return days(date).format("YYYY-MM-DD");
    };

    //token
    res.locals.bearer = {}; // 預設值
    let auth=req.get("Authorization")
    if(auth && auth.indexOf("Bearer ")===0){
        
        auth=auth.slice(7)
          try{
        res.locals.bearer=jwt.verify(auth,process.env.JWT_SECRET)
        }catch(ex){}
    }
       console.log("res.locals.bearer:", res.locals.bearer);
    next()
});


// 會員router
app.use("/member", require("./routes/member"));

app.get("/", (req, res) => {
    res.send("雷猴");

});


// 靜態資料夾
app.use(express.static("public"));

// 404頁面
app.use((req, res) => {
    res.status(404).send(
        "<h1>404</h1><p>找不到頁面</p><img src='imgs/main.jpg'>"
    );
});

// 預防設定檔的port失效+啟動時監聽
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`伺服器啟動:${port}`);
});
