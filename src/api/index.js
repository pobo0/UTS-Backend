const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const transfer = require('./components/bank/bank-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  transfer(app);

  return app;
};
