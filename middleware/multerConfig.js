const multer = require("multer");
const path = require('path')

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, call) => {
    let ext = path.extname(file.originalname);
    if( ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png"){
      call(new Error("File Tidak Support"), false)
      return
    }
    call(null, true)
  }
})
// const storage = multer.diskStorage({
//   destination: function (req, file, call) {
//     call(null, "./public/upload/img");
//   },

//   //add back the extention
//   filename: function (req, file, call) {
//     call(null, `${Date.now() + file.originalname}`);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fieldSize: 1024 * 1024 * 3,
//   },
// });

// module.exports = upload;
