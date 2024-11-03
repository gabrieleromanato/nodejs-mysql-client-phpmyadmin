'use strict';

const { hash } = require('../utils/hash');
const auth = require('../utils/auth');
const User = require('../models/user');

const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = hash(password);
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = hash(password);
        const user = await User.findOne({ email, password: hashedPassword });
        if (!user) {
            return res.status(200).json({ error: 'Invalid credentials' });
        }
        const token = auth.generateToken(user);
        if (!token) {
            return res.status(200).json({ error: 'Token generation failed' });
        }
        return res.status(200).json({ token, email: user.email, name: user.name });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const body = req.body;
        let update = {};
        if (body.name) {
            update.name = body.name;
        }
        if (body.email) {
            update.email = body.email;
        }
        if (body.password) {
            update.password = hash(body.password);
        }
        const user = await User.findByIdAndUpdate(id, update, { new: true });
        if (!user) {
            return res.status(200).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(200).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error });
    }
};


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser
};