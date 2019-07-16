var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', function(req, res){
	console.log("files", req.files)
    if(req.files.image !== undefined){ // `image` is the field name from your form
        res.send("success"); // success
    }else{
        res.send("error, no file chosen");
    }
});

module.exports = router;
