'use strict';

const { Schema, model } = require('mongoose');

const connectionSchema = new Schema({
    host: String,
    port: String,
    username: String,
    password: String,
    database: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

module.exports = model('Connection', connectionSchema, 'connections');