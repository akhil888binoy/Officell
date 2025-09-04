// import multer from 'multer';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'src/public/') 
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname)
//   }
// });

// export const upload = multer({ storage: storage });

import multer from 'multer';
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
});