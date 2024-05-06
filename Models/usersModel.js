const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    address: String,
    email: String,
    userName: String,
    password: String,
    actions: {
        type: Number,
        default: 0 
    }
},
    {
        versionKey: false
    });

const userModel = mongoose.model('user', userSchema, 'users');

module.exports = userModel;
