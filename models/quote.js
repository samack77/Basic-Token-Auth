const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let QuoteSchema = new Schema({
    // Required fields
    ID_type: {type: String, required: true, max: 20, default: 'C.C'},
    personal_ID: {type: String, required: true, max: 30},
    birth_date: {type: Date, required: true},
    year_model: {type: Number, max: 10, required: true},
    brand: {type: String, max: 50, required: true},
    reference: {type: String, max: 300, required: true},
    used_for: {type: String, max: 100, required: true},
    first_name: {type: String, max: 100, required: true},
    last_name: {type: String, max: 100, required: true},
    price: {type: Number, max: 20, required: true},

    // Required fields with defatul data
    license_plate: {type: String, max: 10},    
    is_new: {type: Boolean, default: true},
    gender: {type: String, max: 2, default: 'M'},
    kind_plate: {type: String, max: 20, 'PARTICULAR'},

    // Optional data
    facecolda: {type: String, max: 20},
    alarm: {type: String, max: 20},
    accessories: {type: Number, max: 20, default: 0},    
    city: {type: String, max: 100},
    sinister: {type: Number, max: 5, dafault: 0},
    onerous: {type: Boolean, default: false},    
    marital_status: {type: String, max: 100},    
    studies: {type: String, max: 20},
    social_status: {type: String, max: 20},
    profession: {type: String, max: 20},
    email: {type: String, max: 20},
    phone: {type: String, max: 20},
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    chances: [{ type: Schema.Types.ObjectId, ref: 'Chance' }],

    //System data
    enabled: {type: Boolean, default: true},
    status: {type: String, default: 'FILLING_UP'}
});

module.exports = mongoose.model('Quote', QuoteSchema);