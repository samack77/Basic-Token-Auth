const mongoose = require('mongoose');
var tokenizer = require('../services/tokenizer');

const Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 150},
    hash : String, 
    salt : String,
    is_admin: {type: Boolean, default: false}
});

// method to set salt and hash the password for a user 
// setPassword method first creates a salt unique for every user 
// then it hashes the salt with user password and creates a hash 
// this hash is stored in the database as user password 

UserSchema.methods.setPassword = function(password) {
    const saltAndHash = tokenizer.generateSaltAndHash(password);
    this.salt = saltAndHash.salt;
    this.hash = saltAndHash.hash;
}; 

// method to check entered password is correct or not 
// validPassword method checks whether the user 
// password is correct or not 
// It takes the user password from the request  
// and salt from user database entry 
// It then hashes user password and salt 
// then checks if this generated hash is equal 
// to user's hash in the database or not 
// if user's hash is equal to generated hash  
// then password is correct otherwise not 

UserSchema.methods.validPassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password,  
    this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.hash === hash; 
}; 

// Export the model
module.exports = mongoose.model('User', UserSchema);