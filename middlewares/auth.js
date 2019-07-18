var jwt = require('jwt-simple');
var env = require('../config/env');
var moment = require('moment');
var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.ensureAuthenticated = function(req, res, next) {
  if(!req.headers.authorization) {
    return res
      .status(403)
      .send({message: "Tu petición no tiene cabecera de autorización"});
  }
  
  var token = req.headers.authorization.split(" ")[1];

  try{
    var payload = jwt.decode(token, env.TOKEN_SECRET);
  }catch(exception){
    console.log(exception)
    return res
       .status(401)
        .send({message: "Invalid token"});
  }
  
  if(payload.exp <= moment().unix()) {
     return res
     	.status(401)
        .send({message: "Token has expired"});
  }

  User.findOne({_id: mongoose.Types.ObjectId(payload.sub)}, function (err, user) {
    if (err || !user) {
      return res
       .status(401)
        .send({message: "User not found"});
    }

    req.user = payload.sub;
    req.is_admin = !!user.is_admin;
    next();
  })
}