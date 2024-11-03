'use strict';

const Connection = require('../models/connection');
const validator = require('validator');
const { encrypt } = require('../utils/hash');
const { executeQueryForUser } = require('../utils/mysql');
const User = require('../models/user');

const createConnection = async (req, res, next) => {
    const { host, port, username, password, database } = req.body;
    if (!host || !port || !username || !password || !database) {
        return res.status(200).json({ error: 'All fields are required' });
    }
    if(host !== 'localhost') {
        if(!validator.isIP(host)) {
            return res.status(200).json({ error: 'Invalid host' });
        }
    }
    if(!validator.isPort(port)) {
        return res.status(200).json({ error: 'Invalid port' });
    }
    const encryptedPassword = encrypt(password);
    const connection = new Connection({
        host,
        port,
        username,
        password: encryptedPassword,
        database,
        user: req.body.id
    });
    try {
        const conn = await connection.save();
        const user = await User.findById(req.body.id);
        user.connections.push(conn._id);
        await user.save();
        return res.status(201).json({ message: 'Connection created' });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};

const listTablesInUserDatabase = async (req, res, next) => {
    const { database } = req.query;
    if (!database) {
        return res.status(200).json({ error: 'Database name is required' });
    }
    const query = 'SHOW TABLES';
    const tables = await executeQueryForUser(req.params.id, database, query);
    const tableNames = tables.map((table) => table[`Tables_in_${database}`]);
    if (!tables) {
        return res.status(500).json({ error: 'Failed to fetch tables' });
    }
    return res.status(200).json({ tables: tableNames });
};

const listColumnsAndDataInTable = async (req, res, next) => {
    const { database, table } = req.query;
    if (!database || !table) {
        return res.status(200).json({ error: 'Database and table names are required' });
    }
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const perPage = 10;
    const offset = (page - 1) * perPage
    const queryColumns = `SHOW COLUMNS FROM ${table}`;
    const columns = await executeQueryForUser(req.params.id, database, queryColumns);
    const query = `SELECT * FROM ${table} LIMIT ${offset}, ${perPage}`;
    const data = await executeQueryForUser(req.params.id, database, query);
    if (!data) {
        return res.status(500).json({ error: 'Failed to fetch data' });
    }
    return res.status(200).json({ columns, data });
};

module.exports = { createConnection, listTablesInUserDatabase, listColumnsAndDataInTable };