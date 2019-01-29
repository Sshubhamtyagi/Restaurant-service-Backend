const express = require('express');
const authenticate = require('../auth');
const bodyParser = require('body-parser');
const cors = require('./cors');
const multer = require('multer');
const storage = multer.diskStorage({
  destination :(req,file,cb)=>{
    cb(null,'public/images');
  },
  filename :(req,file,cb)=>{
    cb(null,file.originalname);
  }
});
const imageFilter = (req,file,cb)=>{
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
    return cb(new Error('only images are allowed!'),false);
  }
  cb(null,true);
};

const upload = multer({storage : storage,fileFilter : imageFilter});

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus( 200);})
.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    res.statusCode = 403;
    res.end("get operation not supported");
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    res.statusCode = 403;
    res.end("put operation not supported");
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    res.statusCode = 403;
    res.end("delete operation not supported");
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),upload.single('imageFile'),(req,res)=>{
    res.statusCode = 200;
    res.setHeader('content','application/json');
    res.json(req.file);
});
module.exports = uploadRouter;
