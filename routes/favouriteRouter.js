const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../auth');
const Dishes = require('../models/dishes');
const User = require('../models/user');
const Favorites = require('../models/favourites');
const cors = require('./cors');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus=200;})
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
  Favorites.find({user: req.user})
  .populate('User')
  .populate('Dish')
  .then((favs)=>{
    //console.log(favs.dishes);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(favs);
  },(err)=>next(err))
    .catch((err)=>next(err));
})


.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
  Favorites.findOne({user :req.user})
  .populate('User')
  .populate('Dish')
  .then((favs)=>{
    if(favs==null)
    {
    var dish = {
      user : req.user._id,
      dishes : req.body
    }
  //  if(favs.dishes.length==0)

    Favorites.create(dish)
    .then((dish)=>{
      console.log('dish created');
      res.statusCode =200;
      res.setHeader('content','text/html');
      res.json(dish);

    },(err)=>next(err));
  }
  else{

    for(var j=0;j<req.body.length;j++)
    {
      var f=0;
    for(var i=0;i<favs.dishes.length;i++){
    //  console.log(req.body[j]._id + "      " + favs.dishes[i]._id);
      if(req.body[j]._id==favs.dishes[i]._id){
        f=1;
        break;
      }
    }
    if(f==0){
  favs.dishes.push(req.body[j]._id);
    }

    else {
      console.log("dish already in favs");
      continue;
    }
  }
  favs.save()
  .then((dish)=>{
    console.log('dish created');
    res.statusCode =200;
    res.setHeader('content','text/html');
    res.json(dish);

  },(err)=>next(err));

  }

  },(err)=>next(err))
  .catch((err)=> next(err));

})

  .put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
      res.statusCode = 403;
      res.end("put operation not supported");
  })

  .delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.deleteOne({user :req.user._id})
    .then((resp)=>{

      console.log(resp._doc);
      res.statusCode =200;
      res.setHeader('content','text/html');
      res.json(resp);
    },(err)=>next(err))
    .catch((err)=> next(err));
  });

  module.exports = favoriteRouter;
