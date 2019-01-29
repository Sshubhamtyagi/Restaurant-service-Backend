 const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../auth');
const Dishes = require('../models/dishes');
const User = require('../models/user');
const cors = require('./cors');
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus( 200);})
.get(cors.cors,(req,res,next) => {
    Dishes.find({})
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        var dishes = json(dish);
        //res.json(dishes);
       res.render('pages/index1.ejs',{dishes :dishes});
    }, (err) => next(err))
    .catch((err) => next(err));
})


.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
  Dishes.create(req.body)
  .then((dish)=>{
    console.log('dish created');
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(dish);
  },(err)=>next(err))
  .catch((err)=> next(err));
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    res.statusCode = 403;
    res.end("put operation not supported");
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
  Dishes.remove({})
  .then((resp)=>{
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(resp);
  },(err)=>next(err))
  .catch((err)=> next(err));
});


dishRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus( 200);})

.get(cors.cors,(req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .populate('comments.author')
  .then((dish)=>{
    console.log('dish finded');
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(dish);
  },(err)=>next(err))
  .catch((err)=> next(err));
})


.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{res.statusCode = 403;
res.end("post operation not supported" +req.params.dishId);
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
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


.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
  Dishes.findByIdAndRemove(req.params.dishId)
  .then((resp)=>{
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(resp);
  },(err)=>next(err))
  .catch((err)=> next(err));
});


dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus( 200);})

.get(cors.cors,(req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .populate('comments.author')

  .then((dish)=>{
    if(dish!= null)
    {
      res.statusCode =200;
      res.setHeader('content','text/html');
      res.json(dish.comments);
    }
    else {
      err = new Error('Dish' + req.params.dishId + 'not found');
      err.status = 404;
      return next(err);
    }
  },(err)=>next(err))
  .catch((err)=> next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
  Dishes.findById(req.params.dishId)

  .then((dish)=>{
    if(dish!= null)
  {
    req.body.author = req.user._id;
    dish.comments.push(req.body);
    dish.save()
    .then((dish)=>{
      Dishes.findById(dish._id)
      .populate('comments-author')
      .then((dish)=>{
        res.statusCode =200;
        res.setHeader('content','text/html');
        res.json(dish);
      })
    },(err)=>next(err));

  }
  else {
    err = new Error('Dish' + req.params.dishId + 'not found');
    err.status = 404;
    return next(err);
  }
  },(err)=>next(err))
  .catch((err)=> next(err));
})

.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end("put operation not supported" + req.params.dishId + '/comments');
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .then((dish)=>{
    if(dish!= null)
  {
    for(var i=dish.comments.length-1;i>=0;i--)
    {
      dish.comments.id(dish.comments[i]._id).remove();
    }
    dish.save()
    .then((dish)=>{
      res.statusCode =200;
      res.setHeader('content','text/html');
      res.json(dish);
    },(err)=>next(err));

  }
  else {
    err = new Error('Dish' + req.params.dishId + 'not found');
    err.status = 404;
    return next(err);
  }
  },(err)=>next(err))
  .catch((err)=> next(err));
});


dishRouter.route('/:dishId/comments/:commentId')
.get(cors.cors,(req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .populate('comments.author')
  .then((dish)=>{
    if(dish!= null && dish.comments.id(req.params.commentId)!=null)
    {
      res.statusCode =200;
      res.setHeader('content','text/html');
      res.json(dish.comments.id(req.params.commentId));
    }
    else if(dish==null){
      err = new Error('Dish' + req.params.dishId + 'not found');
      err.status = 404;
      return next(err);
    }
    else {
      err = new Error('Dish' + req.params.commentId + 'not found');
      err.status = 404;
      return next(err);
    }
  },(err)=>next(err))
  .catch((err)=> next(err));
})


.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{res.statusCode = 403;
res.end("post operation not supported" +req.params.commentId);
})

.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
  Dishes.findById(req.params.dishId)
.then((dish)=>{
  //console.log(req.user.id + "    user id      authorid" + dish.comments.id(req.params.commentId).author + "  got it" );
   if(req.user.id != dish.comments.id(req.params.commentId).author)
   {
     err = new Error('you can not update this comment');
     err.status = 404;
     return next(err);
   }

  if(dish!= null && dish.comments.id(req.params.commentId)!=null)
  {
    if(dish!= null && dish.comments.id(req.params.commentId)!=null)
    {

      if(req.body.rating) {


        dish.comments.id(req.params.commentId).rating = req.body.rating;
      }

      if(req.body.comment)  {
        dish.comments.id(req.params.commentId).comment =req.body.comment;
      }
    dish.save()
    .then((dish)=>{
      Dishes.findById(dish._id)
      .populate('comments.author')
      .then((dish)=>{

        res.statusCode =200;
        res.setHeader('content','text/html');
        res.json(dish);
      })
    },(err)=>next(err));

    }
    else if(dish==null){
      err = new Error('Dish' + req.params.dishId + 'not found');
      err.status = 404;
      return next(err);
    }
  }
  else if(dish==null){
    err = new Error('Dish' + req.params.dishId + 'not found');
    err.status = 404;
    return next(err);
  }
  else {
    err = new Error('Dish' + req.params.commentId + 'not found');
    err.status = 404;
    return next(err);
  }
},(err)=>next(err))
  .catch((err)=> next(err));
})


.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .then((dish)=>{
    if(req.user.id != dish.comments.id(req.params.commentId).author)
    {
      err = new Error('you can not delete this comment');
      err.status = 404;
      return next(err);
    }
    if(dish!= null && dish.comments.id(req.params.commentId)!=null)
  {

      dish.comments.id(req.params.commentId).remove();

    dish.save()
    .then((dish)=>{
      Dishes.findById(dish._id)
    .populate('comments.author')
    .then((dish)=>{

      res.statusCode =200;
      res.setHeader('content','text/html');
      res.json(dish);
    })
    },(err)=>next(err));

  }
  else if(dish==null){
    err = new Error('Dish' + req.params.dishId + 'not found');
    err.status = 404;
    return next(err);
  }
  else {
    err = new Error('Dish' + req.params.commentId + 'not found');
    err.status = 404;
    return next(err);
  }
  },(err)=>next(err))
  .catch((err)=> next(err));
});

module.exports = dishRouter;
