var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');
var tokenizer = require('../services/tokenizer');
var validator = require('../services/validator')

function check_required_fileds(body) {
    if (!'password' in body)
        return false;

    if (!'email' in body)
        return false;

    if (!validator.validateEmail(body.email))
        return false;

    return true;
}

router.post('/sign-up', function(req, res, next) {
	var user = new User({
        name: req.body.name,
    	email: req.body.email.toLowerCase()
    });

    user.setPassword(req.body.password);
    
    user.save(function(err){
        if (err)
            return res
                .status(400)
                .send({message : "Missing params"}); 
        else
            return res
    		    .status(200)
        	    .send({token: tokenizer.createToken(user)});
    });
});

router.post('/sign-in', function(req, res) {
    if (!check_required_fileds(req.body))
        return res
                .status(400)
                .send({message : "Missing params on validations"});

	User.findOne({email: req.body.email.toLowerCase()}, function(err, user) {
    	// Check for errors
        // and if user exist
        // and password is ok

        if (!user)
            return res
                .status(400)
                .send({message : "User not found."});
        else{
            if (user.validPassword(req.body.password)) { 
                return res
                    .status(200)
                    .send({token: tokenizer.createToken(user), message : "User Logged In"});
            }else{ 
                return res
                    .status(400)
                    .send({message : "Wrong Password"}); 
            }
        }
    });
});

module.exports = router;