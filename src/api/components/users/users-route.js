const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const usersControllers = require('./users-controller');
const usersValidator = require('./users-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/users', route);

  // Get list of users
  route.get(
    '/',
    authenticationMiddleware.authenticate,
    usersControllers.getUsers
  );

  // Create user
  route.post(
    '/',
    authenticationMiddleware.authenticate,
    celebrate(usersValidator.createUser),
    usersControllers.createUser
  );

  // Get user detail
  route.get(
    '/:id',
    authenticationMiddleware.authenticate,
    usersControllers.getUser
  );

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware.authenticate,
    celebrate(usersValidator.updateUser),
    usersControllers.updateUser
  );

  // Delete user
  route.delete(
    '/:id',
    authenticationMiddleware.authenticate,
    usersControllers.deleteUser
  );

  // Change password
  route.post(
    '/:id/change-password',
    authenticationMiddleware.authenticate,
    celebrate(usersValidator.changePassword),
    usersControllers.changePassword
  );
};
