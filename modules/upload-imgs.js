const multer = require("multer");

// 解構設定，引入uuid但只用到v4版，然後再改名成uuidv4
const { v4: uuidv4 } = require("uuid");

// 建立一個檔案格式的物件
const extMap = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
};

// fileFilter做檔案的篩選
// file就是req.file，cb是callback
const fileFilter = (req, file, cb) => {
  // 讓file裡的mimetype當成key去比對extMap裡面得值，
  // 如果有對應到就會拿到值，沒有就會是undefined，再透過!!轉成布林值
  // null是錯誤先行，但我們這沒有要設定錯誤會發生啥所以一律設null
  // 如果要使用的話格式要與正常輸出一致，不然一旦發生錯誤產生的格式不同很難處理
  cb(null, !!extMap[file.mimetype]);
};

// storage決定要存在那、叫啥
const storage = multer.diskStorage({
  // 存在哪
  destination: (req, file, cb) => {
    cb(null, __dirname + "./../../JIM-member/public/Images/uploads");
  },
  //   叫啥
  filename: (req, file, cb) => {
    const ext = extMap[file.mimetype]; // 副檔名
    const fid = uuidv4(); // 主檔名(雜湊過)
    cb(null, fid + ext);
  },
});

// 有檔案上傳時呼叫fileFilter、storage這兩function
// 匯出
module.exports = multer({ fileFilter, storage });
