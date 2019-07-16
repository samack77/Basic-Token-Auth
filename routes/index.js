var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.status(200).send({ message: 'Express' });
});

router.post('/upload', function(req, res){
	console.log("files", req.files)
    if(req.files.image !== undefined){ // `image` is the field name from your form
        return res.status(200).send("success"); // success
    }else{
        return res.status(400).send({message: "error, no file chosen"});
    }
});

module.exports = router;
