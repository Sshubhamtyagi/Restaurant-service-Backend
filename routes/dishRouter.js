const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();


dishRouter.use(bodyParser.json());


dishRouter.route('/')
.all((req,res,next)=>{
  res.statusCode = 200;
  res.setHeader('content','text/html');
   next();
})

.get((req,res,next)=>{
  res.end("will send all dishes");
})

.post((req,res,next)=>{
  res.end("added " + req.body.name + "and" + req.body.description)
})

.put((req,res,next)=>{
    res.statusCode = 403;
    res.end("put operation not supported");
})

.delete((req,res,next)=>{
  res.end("deleting dishes ");
}) ;


dishRouter.route('/:dishId')
.all((req,res,next)=>{
  res.statusCode = 200;
  res.setHeader('content','text/html');
   next();
})

.get((req,res,next)=>{
  res.end("will send detalis of  dish" + req.params.dishId);
})

.post((req,res,next)=>{res.statusCode = 403;
res.end("post operation not supported" +req.params.dishId);
})

.put((req,res,next)=>{
  res.write("updating " +req.params.dishId);
  res.end("detalis are " + req.body.name +"and" + req.body.description);
})

.delete((req,res,next)=>{
  res.end("deleting" + req.params.dishId);


}) ;


module.exports = dishRouter;
