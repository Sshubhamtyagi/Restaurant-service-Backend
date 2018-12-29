const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();


leaderRouter.use(bodyParser.json());


leaderRouter.route('/')
.all((req,res,next)=>{
  res.statusCode = 200;
  res.setHeader('content','text/html');
   next();
})

.get((req,res,next)=>{
  res.end("will show all leaders name");
})

.post((req,res,next)=>{
  res.end("added " + req.body.name + "and" + req.body.description)
})

.put((req,res,next)=>{
    res.statusCode = 403;
    res.end("put operation not supported");
})

.delete((req,res,next)=>{
  res.end("deleting leaders ");
}) ;


leaderRouter.route('/:leaderId')
.all((req,res,next)=>{
  res.statusCode = 200;
  res.setHeader('content','text/html');
   next();
})

.get((req,res,next)=>{
  res.end("will send detalis of  leader " + req.params.leaderId);
})

.post((req,res,next)=>{res.statusCode = 403;
res.end("post operation not supported" +req.params.leaderId);
})

.put((req,res,next)=>{
  res.write("updating " +req.params.leaderId);
  res.end("detalis are " + req.body.name +" and " + req.body.description);
})

.delete((req,res,next)=>{
  res.end("deleting  particular leader" + req.params.leaderId);


}) ;


module.exports = leaderRouter;
