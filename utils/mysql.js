'use strict';

const mysql = require('mysql2/promise');
const User = require('../models/user');
const { decrypt } = require('./hash');

const getUserConnectionDetails = async (userId, databaseName) => {
    try {
        const user = await User.findById(userId).populate('connections').exec();
        const connections = user.connections.filter((connection) => connection.database === databaseName);
        return connections.length > 0 ? connections[0] : null;
    } catch (error) {
        return null;
    }
};

const createMySQLConnectionPool = async (userId, databaseName) => {
    const connectionDetails = await getUserConnectionDetails(userId, databaseName);
    if (!connectionDetails) {
        return null;
    }

    const { host, port, username, password, database } = connectionDetails;
    const decryptedPassword = decrypt(password);
    return mysql.createPool({
        host,
        port,
        user: username,
        password: decryptedPassword,
        database,
    });
};

const executeQueryForUser = async (userId, databaseName, query) => {
    const pool = await createMySQLConnectionPool(userId, databaseName);
    if (!pool) {
        return null;
    }

    const [rows] = await pool.query(query);
    pool.end();
    return rows;
};

module.exports = { executeQueryForUser };
