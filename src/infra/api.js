const express = require('express');
const cors = require('cors');
const services = require('./http.service')
const api = express();

api.use(express.json());
api.use(cors())

api.post('/games', services.logRequest, services.createGame);
api.get('/ladder', services.logRequest, services.showLadder);

module.exports = api;
