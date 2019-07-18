var express = require('express');
var mongoose = require('mongoose');
var crypto = require('crypto'); 
var tokenizer = require('../services/tokenizer');
var authMiddleware = require('../middlewares/auth')

var User = mongoose.model('User');
var router = express.Router();

function get_user_by_id(user_id, cb){
	User.findOne({_id: mongoose.Types.ObjectId(user_id)}, function (err, user) {
		cb(err, user);
	})
}

router.post('/:user_id', authMiddleware.ensureAuthenticated, function(req, res, next) {
	var user_id = req.params.user_id;
	if (user_id == "me")
		user_id = req.user;

	if (user_id != req.user && !req.is_admin)
		return res
	      .status(403)
	      .send({message: "You do not have permissions to do this."});

	let new_data = {
        name: req.body.name,
    	email: req.body.email.toLowerCase()
    }

    if (req.is_admin)
    	new_data.is_admin = req.body.is_admin

    console.log("is_admin param: ", req.body.is_admin, typeof req.body.is_admin);

    if (req.body.password){
    	const saltAndHash = tokenizer.generateSaltAndHash(req.body.password);
		new_data.salt = saltAndHash.salt;
	    new_data.hash = saltAndHash.hash;
	}

	User.updateOne({_id: mongoose.Types.ObjectId(user_id)}, new_data, function(err){
        if (err)
            return res
                .status(400)
                .send({message : "Missing params"}); 
        else
            return res
    		    .status(200)
        	    .send({message : "User updated successfully"});
    });
});

/* GET users listing. */
router.get('/:user_id', authMiddleware.ensureAuthenticated, function(req, res, next) {
	var user_id = req.params.user_id;
	if (user_id == "me")
		user_id = req.user;

	if (user_id != req.user && !req.is_admin) {
		return res
	      .status(403)
	      .send({message: "You do not have permissions to do this."});
	}

	get_user_by_id(user_id, function (err, user) {
		if (err)
			return res
				.status(500)
				.send({message: "Oops, Something is wrong!"});
		else
			if (user)
				return res
					.status(200)
					.send({email: user.email, name: user.name, is_admin: user.is_admin, message: "User found"});
			else
				return res
					.status(404)
					.send({message: "User not found"});
	});
});

/* GET users listing. */
router.get('/', authMiddleware.ensureAuthenticated, function(req, res, next) {
	let query = {};
	if (!req.is_admin)
		query = {
			_id: mongoose.Types.ObjectId(req.user)
		};

	User.find(query, function (err, users) {
		if (err)
			return res
				.status(500)
				.send({message: "Oops, Something is wrong!"});
		else{
			const users_res = users.map(function (user, index){
				return {id: user._id, email: user.email, name: user.name, is_admin: user.is_admin}
			});

			return res
				.status(200)
				.send({data: users_res, message: "Users found"});
		}
	});
});

router.post('/', authMiddleware.ensureAuthenticated, function(req, res, next) {
	if (!req.is_admin) {
		return res
	      .status(403)
	      .send({message: "You do not have permissions to do this."});
	}

	var user = new User({
        name: req.body.name,
    	email: req.body.email.toLowerCase(),
    	is_admin: req.body.is_admin
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
        	    .send({message : "User created successfully"});
    });
});

module.exports = router;
