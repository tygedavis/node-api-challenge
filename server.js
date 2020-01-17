const express = require('express');
const dbrouter = require('./dbrouter');
const server = express();

//Global Middleware
server.use(logger);

server.use(express.json());

//Routers
server.use('/api/projects', dbrouter);

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`)

  next();
};

module.exports = server;