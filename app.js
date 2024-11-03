'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const routes = require('./routes');

mongoose.connect(process.env.DBURI);

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

app.listen(PORT);