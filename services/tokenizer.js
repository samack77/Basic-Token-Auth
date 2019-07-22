// services.js
var jwt = require('jwt-simple');
var env = require('../config/env');
var crypto = require('crypto');
var mongoose = require('mongoose');
var moment = require('moment');

exports.createToken = function(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, "days").unix(),
  };
  return jwt.encode(payload, env.TOKEN_SECRET);
};

exports.generateSaltAndHash = function(password){
  let res = {};
  // creating a unique salt for a particular user 
  res.salt = crypto.randomBytes(16).toString('hex'); 

  // hashing user's salt and password with 1000 iterations, 
  // 64 length and sha512 digest 
  res.hash = crypto.pbkdf2Sync(password, res.salt,  
  1000, 64, `sha512`).toString(`hex`); 
  return res;
};