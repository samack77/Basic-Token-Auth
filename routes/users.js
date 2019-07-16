var express = require('express');
var mongoose = require('mongoose');
var tokenizer = require('../services/tokenizer');
var User = mongoose.model('User');
var router = express.Router();

/* GET users listing. */
router.get('/me', tokenizer.ensureAuthenticated, function(req, res, next) {
	User.findOne({_id: mongoose.Types.ObjectId(req.user)}, function (err, user) {
		if (err)
			return res
				.status(500)
				.send({message: "Oops, Something is wrong!"});
		else
			if (user)
				return res
					.status(200)
					.send({email: user.email, name: user.name, message: "User found"});
			else
				return res
					.status(404)
					.send({message: "User not found"});
	})
});

module.exports = router;
