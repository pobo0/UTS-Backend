const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const bankControllers = require('./bank-controller');
const bankValidator = require('./bank-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/transferbank', route);

  route.get(
    '/', // Menghapus duplikasi definisi rute
    authenticationMiddleware.authenticate,
    bankControllers.getTransfer
  );

  route.post(
    '/:userID', // Memperbaiki path untuk POST request
    authenticationMiddleware.authenticate,
    celebrate(bankValidator.createTransfer),
    bankControllers.createTransfer
  );

  route.delete(
    '/:userID',
    authenticationMiddleware.authenticate,
    bankControllers.deleteTransfer // Memperbaiki pengontrol rute untuk DELETE request
  );

  route.put(
    '/:userID', // Memperbaiki path untuk PUT request
    authenticationMiddleware.authenticate,
    celebrate(bankValidator.updateTransfer),
    bankControllers.transferUpdate
  );
};
