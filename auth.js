var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((User.serializeUser()));
passport.deserializeUser((User.deserializeUser()));

exports.getToken = function(user){
  return jwt.sign(user,config.secretKey,{expiresIn: 3600});
};
var opts ={
  'secretOrKey':config.secretKey,
  'jwtFromRequest':ExtractJwt.fromAuthHeaderAsBearerToken('bearer')
};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('bearer');
// opts.secretOrKey = config.secretKey;

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload._id}, function(err, user) {
      User.findById(jwt_payload._id)
                    .then(user => {
                        if (user) {
                            return done(null, user);
                        }
                        return done(null, false);
                    })
                    .catch(err => console.log(err));

    });
}));
exports.verifyUser = passport.authenticate('jwt', {session: false});
exports.verifyAdmin = function(user){
  return (req,res,next)=>{
    console.log(req.user.admin)
    if(req.user){
  if( req.user.admin==true)
  next();
  else {
    var err = new Error('You are not Admin!');
    err.status = 403;
    next(err);
  }
}
else {
  var err = new Error('You are not Admin!');
  err.status = 403;
  next(err);
}
  }
};
