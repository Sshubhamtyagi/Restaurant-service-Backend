const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();


dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req,res,next)=>{
  Dishes.find({})
  .then((dishes)=>{
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(dishes);
  },(err)=>next(err))
  .catch((err)=> next(err));

})

.post((req,res,next)=>{
  Dishes.create(req.body)
  .then((dish)=>{
    console.log('dish created');
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(dish);
  },(err)=>next(err))
  .catch((err)=> next(err));
})

.put((req,res,next)=>{
    res.statusCode = 403;
    res.end("put operation not supported");
})

.delete((req,res,next)=>{
  Dishes.remove({})
  .then((resp)=>{
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(resp);
  },(err)=>next(err))
  .catch((err)=> next(err));
});


dishRouter.route('/:dishId')
.get((req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .then((dish)=>{
    console.log('dish finded');
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(dish);
  },(err)=>next(err))
  .catch((err)=> next(err));
})


.post((req,res,next)=>{res.statusCode = 403;
res.end("post operation not supported" +req.params.dishId);
})

.put((req,res,next)=>{
  Dishes.findByIdAndUpdate(req.params.dishId,{
    $set : req.body
  },{new : true})
  .then((dish)=>{
    console.log('dish updated');
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(dish);
  },(err)=>next(err))
  .catch((err)=> next(err));
})


.delete((req,res,next)=>{
  Dishes.findByIdAndRemove(req.params.dishId)
  .then((resp)=>{
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(resp);
  },(err)=>next(err))
  .catch((err)=> next(err));
});


module.exports = dishRouter;
