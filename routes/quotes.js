var express = require('express');
var mongoose = require('mongoose');
var authMiddleware = require('../middlewares/auth')

var Quote = mongoose.model('Quote');
var router = express.Router();

/* GET quotes listing. */
router.get('/', authMiddleware.ensureAuthenticated, function(req, res, next) {
	let query = {
		enabled: true
	};
	if (!req.is_admin)
		query["user"] = mongoose.Types.ObjectId(req.user);

	Quote.find(query, function (err, items) {
		if (err)
			return res
				.status(500)
				.send({message: "Oops, Something is wrong!"});
		else{
			const items_res = items.map(function (item, index){
				return {
					id: item._id, 
					license_plate: item.license_plate, 
					personal_ID: item.personal_ID, 
					reference: item.reference,
					user: item.user,
					first_name: item.first_name,
					last_name: item.last_name,
					status: item.status
				}
			});

			return res
				.status(200)
				.send({data: items_res, message: "Items found"});
		}
	});
});


router.post('/', authMiddleware.ensureAuthenticated, function(req, res, next) {
	if (!req.is_admin) {
		return res
	      .status(403)
	      .send({message: "You do not have permissions to do this."});
	}

	let data = req.body;
	data["user"] = req.user;
	let quote = new Quote(data);    
    quote.save(function(err){
        if (err)
            return res
                .status(400)
                .send({message : "Missing params"}); 
        else
            return res
    		    .status(200)
        	    .send({message : "Item created successfully", id: quote._id});
    });
});

// router.post('/:user_id', authMiddleware.ensureAuthenticated, function(req, res, next) {
// 	var user_id = req.params.user_id;
// 	if (user_id == "me")
// 		user_id = req.user;

// 	if (user_id != req.user && !req.is_admin)
// 		return res
// 	      .status(403)
// 	      .send({message: "You do not have permissions to do this."});

// 	let new_data = {
//         name: req.body.name,
//     	email: req.body.email.toLowerCase()
//     }

//     if (req.is_admin)
//     	new_data.is_admin = req.body.is_admin

//     console.log("is_admin param: ", req.body.is_admin, typeof req.body.is_admin);

//     if (req.body.password){
//     	const saltAndHash = tokenizer.generateSaltAndHash(req.body.password);
// 		new_data.salt = saltAndHash.salt;
// 	    new_data.hash = saltAndHash.hash;
// 	}

// 	User.updateOne({_id: mongoose.Types.ObjectId(user_id)}, new_data, function(err){
//         if (err)
//             return res
//                 .status(400)
//                 .send({message : "Missing params"}); 
//         else
//             return res
//     		    .status(200)
//         	    .send({message : "User updated successfully"});
//     });
// });

/* GET users listing. */
// router.get('/:user_id', authMiddleware.ensureAuthenticated, function(req, res, next) {
// 	var user_id = req.params.user_id;
// 	if (user_id == "me")
// 		user_id = req.user;

// 	if (user_id != req.user && !req.is_admin) {
// 		return res
// 	      .status(403)
// 	      .send({message: "You do not have permissions to do this."});
// 	}

// 	User.findOne({_id: mongoose.Types.ObjectId(user_id)}, function (err, user) {
// 		if (err)
// 			return res
// 				.status(500)
// 				.send({message: "Oops, Something is wrong!"});
// 		else
// 			if (user)
// 				return res
// 					.status(200)
// 					.send({id: user._id, email: user.email, name: user.name, is_admin: user.is_admin, message: "User found"});
// 			else
// 				return res
// 					.status(404)
// 					.send({message: "User not found"});
// 	});
// });


// router.delete('/:user_id', authMiddleware.ensureAuthenticated, function(req, res, next) {
// 	var user_id = req.params.user_id;
// 	if (user_id == "me")
// 		user_id = req.user;

// 	if (user_id != req.user && !req.is_admin) {
// 		return res
// 	      .status(403)
// 	      .send({message: "You do not have permissions to do this."});
// 	}


//     User.deleteOne({_id: mongoose.Types.ObjectId(user_id)}, function (err) {
//     	if (err)
//             return res
//                 .status(400)
//                 .send({message : "Oops! Something is wrong.."}); 
//         else
//             return res
//     		    .status(200)
//         	    .send({message : "User deleted successfully"});
// 	});
// });

module.exports = router;
