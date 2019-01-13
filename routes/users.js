var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();
var passport = require('passport')
router.use(bodyParser.json());

router.get('/',(req, res, next)=> {
  res.send('respond with a resource');
});
router.post('/signup',(req,res,next)=>{
  User.register(new User({username:req.body.username}),
  req.body.password ,(err,user)=>{
    if(err){
        res.statusCode=200;
        res.setHeader('Content','application/json');
        res.json({err :err});
    }
    else {
    passport.authenticate('local')(req,res,()=>{
        res.statusCode=200;
        res.setHeader('Content','application/json');
        res.json({success : true, status:'Registration-successful'});
    });
  }
});
});
router.post('/login',passport.authenticate('local'),(req,res,next)=>{
  res.statusCode=200;
  res.setHeader('Content','application/json');
  res.json({success : true, status:'Logged in'});
})

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});


module.exports = router;
