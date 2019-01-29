const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
const Leaders = require('../models/leaders');
const authenticate = require('../auth');
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus( 200);})
.get(cors.cors,(req,res,next)=>{
  Leaders.find({})
  .then((leaders)=>{
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(leaders);
  },(err)=>next(err))
  .catch((err)=> next(err));

})

.post(authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
  Leaders.create(req.body)
  .then((leader)=>{
    console.log('leader created');
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(leader);
  },(err)=>next(err))
  .catch((err)=> next(err));
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    res.statusCode = 403;
    res.end("put operation not supported");
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
  Leaders.remove({})
  .then((resp)=>{
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(resp);
  },(err)=>next(err))
  .catch((err)=> next(err));
});


leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus( 200);})
.get(cors.cors,(req,res,next)=>{
  Leaders.findById(req.params.leaderId)
  .then((leader)=>{
    console.log('leader finded');
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(leader);
  },(err)=>next(err))
  .catch((err)=> next(err));
})


.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{res.statusCode = 403;
res.end("post operation not supported" +req.params.dishId);
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
  Leaders.findByIdAndUpdate(req.params.leaderId,{
    $set : req.body
  },{new : true})
  .then((leader)=>{
    console.log('leader updated');
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(leader);
  },(err)=>next(err))
  .catch((err)=> next(err));
})


.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
  Leaders.findByIdAndRemove(req.params.leaderId)
  .then((resp)=>{
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(resp);
  },(err)=>next(err))
  .catch((err)=> next(err));
});


module.exports = leaderRouter;
