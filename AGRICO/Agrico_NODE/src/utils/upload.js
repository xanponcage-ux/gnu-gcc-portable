const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const env = require('../env')

if (env?.deploy === 'Y') {
  global.__basedir = "/var/www/html/"; //__dirname;
} else {
  global.__basedir = "D:/MY Project/CRM_TSK_NODE/"; //__dirname;
}
//global.__basedir = "D:/Office Work/MES Production Deployment/For Quality Deplaoyement/API/public/shedatafiles/"; //__dirname;
//Office Work\MES Production Deployment\For Quality Deplaoyement\API\public\shedatafiles
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/shedatafiles/");
  },
  filename: (req, file, cb) => {
    //console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  //limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
