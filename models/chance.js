const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var ChanceSchema = new Schema({ 
    title: String,
    date_fetch: Date,
    value: String,
    company: String,
    pdf: String,
    features: String
});

module.exports = mongoose.model('Chance', ChanceSchema);