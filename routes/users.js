var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();
router.use(bodyParser.json());

router.get('/',(req, res, next)=> {
  res.send('respond with a resource');
});
router.post('/signup',(req,res,next)=>{
  User.findOne({username:req.body.username})
  .then((user)=>{
    if(user!=null){
      var err = new Error('User' + req.body.username + "already exists");
      err.status = 403;
      next(err);
    }
    else {
      return User.create({
        username : req.body.username,
        password : req.body.password
      });
    }

  })
  .then((user)=>{
    res.statusCode=200;
    res.setHeader('conten-type','application/json');
    res.json({status:'Registration-successful',user : user});
  },(err)=>next(err))
  .catch((err)=>next(err));
});

router.post('/login',(req,res,next)=>{
  console.log(req.session.user + '    hey yo');
  if(!req.session.user){
    var authHeader = req.headers.authorization;

    if(!authHeader){
      var err = new Error("you are not authenticated");
      res.setHeader ('WWW-Authenticate','Basic');
      err.status =401;
      return next(err);
    }

    var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
    var userName = auth[0];
    var password = auth[1];
    User.findOne({username:userName})
    .then((user)=>{
      if(user==null){
        var err = new Error("User don't exist " + userName);
        res.setHeader ('WWW-Authenticate','Basic');
        err.status =401;
        return next(err);
      }
      else if(user.password!=password){
        var err = new Error("password incorrect");
        res.setHeader ('WWW-Authenticate','Basic');
        err.status =401;
        return next(err);
      }
      else  if(user.username ==userName && user.password==password){
            req.session.user = 'authenticated';
            res.statusCode =200;
            res.setHeader('content','text/plain');
            res.end('you are authenticated');

          }

    })
    .catch((err)=>next(err));

   }

   else{
     res.statusCode = 200;
     res.setHeader('content','text/plain');
     res.end('you are already authenticated');

   }
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
