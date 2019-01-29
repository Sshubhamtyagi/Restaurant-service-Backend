var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
const cors = require('./cors');
var authenticate = require('../auth')
var router = express.Router();
var passport = require('passport')
router.use(bodyParser.json());

router.get('/',cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req, res, next)=> {
  User.find({})
  .then((users)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);

  })
});
router.get('/signup',cors.corsWithOptions,(req,res)=>{
  res.render("signup.ejs");
});

router.post('/signup',cors.corsWithOptions,(req,res,next)=>{
  console.log(req.body);
  User.register(new User({username:req.body.username}),
  req.body.password ,(err,user)=>{
    if(err){
        res.statusCode=200;
        res.setHeader('Content','application/json');
        res.json({err :err});
    }
    else {
      if(req.body.firstname)
      user.firstname = req.body.firstname;
      if(req.body.lastname)
      user.lastname = req.body.lastname;
      user.save((err,user)=>{
        if(err)
        {res.statusCode=500;
        res.setHeader('Content','application/json');
        res.json({err : err});
        return;
        }
        passport.authenticate('local')(req,res,()=>{
            res.statusCode=200;
            res.setHeader('Content','application/json');
            //res.json({success : true, status:'Registration-successful'});
res.redirect('/users/login');
      });
    });
  }
});
});

router.get('/login',cors.corsWithOptions,(req,res)=>{
  res.render('login.ejs');
});
router.post('/login',cors.corsWithOptions,passport.authenticate('local'),(req,res,next)=>{
var token = authenticate.getToken({_id: req.user._id});
  res.statusCode=200;
  res.setHeader('Content','application/json');
  res.json({success : true,token: token, status:'Logged in'});
  res.redirect('/dishes',{})
})

router.get('/logout',cors.corsWithOptions, (req, res,next) => {
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
