'use strict';

const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: 'user',
    },
    connections: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Connection',
        },
    ]
});
module.exports = model('User', userSchema, 'users');