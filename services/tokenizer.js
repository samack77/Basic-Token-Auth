// services.js
var jwt = require('jwt-simple');
var moment = require('moment');
var env = require('../config/env');
var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.createToken = function(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, "days").unix(),
  };
  return jwt.encode(payload, env.TOKEN_SECRET);
};


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