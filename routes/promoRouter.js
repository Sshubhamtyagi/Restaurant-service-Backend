const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../auth');

const Promos = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next)=>{
  Promos.find({})
  .then((promos)=>{
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(promos);
  },(err)=>next(err))
  .catch((err)=> next(err));

})

.post(authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
  Promos.create(req.body)
  .then((promo)=>{
    console.log('promo created');
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(promo);
  },(err)=>next(err))
  .catch((err)=> next(err));
})

.put(authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    res.statusCode = 403;
    res.end("put operation not supported");
})

.delete(authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
  Promos.remove({})
  .then((resp)=>{
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(resp);
  },(err)=>next(err))
  .catch((err)=> next(err));
});


promoRouter.route('/:promoId')
.get((req,res,next)=>{
  Promos.findById(req.params.promoId)
  .then((promo)=>{
    console.log('promo finded');
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(promo);
  },(err)=>next(err))
  .catch((err)=> next(err));
})


.post(authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{res.statusCode = 403;
res.end("post operation not supported" +req.params.dishId);
})

.put(authenticate.verifyUser,(req,res,next)=>{
  Promos.findByIdAndUpdate(req.params.promoId,{
    $set : req.body
  },{new : true})
  .then((promo)=>{
    console.log('promo updated');
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(promo);
  },(err)=>next(err))
  .catch((err)=> next(err));
})


.delete(authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
  Promos.findByIdAndRemove(req.params.promoId)
  .then((resp)=>{
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(resp);
  },(err)=>next(err))
  .catch((err)=> next(err));
});



module.exports = promoRouter;
