// Initial dependencies
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// API dependencies
var mongoose = require('mongoose');
var cors = require('cors');

// Upload file libraries
var multer = require('multer');
var multerS3 = require('multer-s3')
var AWS = require('aws-sdk');

// AWS keys
var accessKeyId =  process.env.AWS_ACCESS_KEY || "";
var secretAccessKey = process.env.AWS_SECRET_KEY || "";

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});

var s3 = new AWS.S3();

// Models
const User = require('./models/user');
const Chance = require('./models/chance');
const Quote = require('./models/quote');

// Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var quotesRouter = require('./routes/quotes');
var authRouter = require('./routes/auth');

var app = express();

function upload_file_to_s3(file, data) {
	var params = {
      Bucket: 'smart_bots',
      Key: file.name,
      Body: data
    };

    s3.putObject(params, function (perr, pres) {
      if (perr) {
        console.log("Error uploading data: ", perr);
      } else {
        console.log("Successfully uploaded data to myBucket/myKey");
      }
    });
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({ 
  limits : { fileSize:20000000 },
  storage: multerS3({
    s3: s3,
    bucket: 'smartbotsgm',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
}).any());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/quotes', quotesRouter);

// Iniciamos el servidor y la base de datos
mongoose.connect('mongodb://localhost:27017/quotes', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',  function() {
	// Comprobar errores siempre
	console.log("mongose connected")
})

module.exports = app;
