const bankService = require('./bank-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get transfer request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middleware
 * @returns {object} Response object or passes an error to the next route
 */
async function getTransfer(request, response, next) {
  try {
    const transfer = await bankService.getTransfers();
    return response.status(200).json(transfer);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update transfer request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middleware
 * @returns {object} Response object or passes an error to the next route
 */
async function transferUpdate(request, response, next) {
  try {
    const userId = request.params.userId;
    const jumlah = request.body.jumlah;

    const success = await bankService.updateTransfer(userId, jumlah);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update transfer'
      );
    }
    return response.status(200).json({ userId });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete transfer request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middleware
 * @returns {object} Response object or passes an error to the next route
 */
async function deleteTransfer(request, response, next) {
  try {
    const userId = request.params.userId;

    const success = await bankService.deleteTransfer(userId);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete transfer'
      );
    }
    return response.status(200).json({ userId });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create transfer request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middleware
 * @returns {object} Response object or passes an error to the next route
 */
async function createTransfer(request, response, next) {
  try {
    const jumlah = request.body.jumlah;
    const userId = request.params.userId;

    const success = await bankService.createTransfer(userId, jumlah);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create transfer'
      );
    }
    return response.status(200).json({ userId });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getTransfer,
  transferUpdate,
  deleteTransfer,
  createTransfer,
};
