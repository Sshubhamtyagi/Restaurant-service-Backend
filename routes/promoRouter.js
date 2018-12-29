const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();


promoRouter.use(bodyParser.json());


promoRouter.route('/')
.all((req,res,next)=>{
  res.statusCode = 200;
  res.setHeader('content','text/html');
   next();
})

.get((req,res,next)=>{
  res.end("will show all promos");
})

.post((req,res,next)=>{
  res.end("added " + req.body.name + "and" + req.body.description)
})

.put((req,res,next)=>{
    res.statusCode = 403;
    res.end("put operation not supported");
})

.delete((req,res,next)=>{
  res.end("deleting promos ");
}) ;


promoRouter.route('/:promoId')
.all((req,res,next)=>{
  res.statusCode = 200;
  res.setHeader('content','text/html');
   next();
})

.get((req,res,next)=>{
  res.end("will send detalis of  promo" + req.params.promoId);
})

.post((req,res,next)=>{res.statusCode = 403;
res.end("post operation not supported" +req.params.promoId);
})

.put((req,res,next)=>{
  res.write("updating " +req.params.promoId);
  res.end("detalis are " + req.body.name +" and " + req.body.description);
})

.delete((req,res,next)=>{
  res.end("deleting promo" + req.params.promoId);


}) ;


module.exports = promoRouter;
