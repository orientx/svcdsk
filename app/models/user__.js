'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const CryptUtils = require(path.join(__dirname,'utils/crypt'));
const validator = require('validator');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        index: { unique: true },
        required: true,
        validate: [email => { // Since Validator version 5.0.0 validator.isEmail itself does not work. I had to wrap it with a function, so it works.
            return validator.isEmail(email)
        }, 'user.invalidemail']
    },
    user_name: {
        type: String,
        index: { unique: true },
        required: true
    },
    password: {
        type: String
    },
    creation_date: {
        type: Date,
        default: new Date()
    }
});

UserSchema.post('validate', doc => {
    if (doc.isModified('password')) {
        doc.password = CryptUtils.encrypt(doc.password);
    }

    if (!doc._id) {
        doc.creation_date = Date.now();
    }
});

UserSchema.plugin(uniqueValidator, { message: 'mongoose.unique-error' });

module.exports = mongoose.model('User', UserSchema);
