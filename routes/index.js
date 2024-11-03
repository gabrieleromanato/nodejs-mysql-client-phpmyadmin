'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const connectionController = require('../controllers/connections');
const auth = require('../utils/auth');

router.post('/users/create', userController.createUser);
router.post('/users/login', userController.loginUser);
router.put('/users/update/:id', auth.authMiddleware, userController.updateUser);
router.delete('/users/delete/:id', auth.authMiddleware, userController.deleteUser);

router.get('/connections/:id/tables', auth.authMiddleware, connectionController.listTablesInUserDatabase);
router.get('/connections/:id/data', auth.authMiddleware, connectionController.listColumnsAndDataInTable);
router.post('/connections/create', auth.authMiddleware, connectionController.createConnection);

module.exports = router;