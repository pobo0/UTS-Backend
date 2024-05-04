const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
//menyimpan berapa banyak gagal kedalam data
const attemptsLOGIN = {};
/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;
  try {
    // menyimpan percobaan yang gagal
    const usedEmail = email.toLowerCase();
    if (
      attemptsLOGIN[usedEmail] &&
      attemptsLOGIN[usedEmail].attemptCount >= 5
    ) {
      //jika gagal lebih dari 5 maka akan terblokir
      const lastfailTIME = attemptsLOGIN[usedEmail].timestamp;
      const currentTIME = Date.now();
      const diffTIME = currentTIME - lastfailTIME;
      const ReEnterMIN = Math.ceil((1800000 - diffTIME) / 60000);

      if (diffTIME < 1800000) {
        throw errorResponder(
          errorTypes.TOO_MANY_ATTEMPTS,
          `Anda terlalu banyak melakukan percobaan login. Tunggu ${ReEnterMIN} Menit untuk melakukan Login lagi`
        );
      } else {
        //reset login attempts
        delete attemptsLOGIN[usedEmail];
        delete attemptsLOGIN[`${usedEmail}_timestamp`];
      }
    }
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      //menyimpan percobaan yang gagal
      if (!attemptsLOGIN[usedEmail]) {
        attemptsLOGIN[usedEmail] = {
          attemptCount: 1,
          timestamp: new Date().getTime(),
        };
      } else {
        attemptsLOGIN[usedEmail].attemptCount++;
        attemptsLOGIN[usedEmail].timestamp = new Date().getTime();
      }

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong Email or password',
        // Mengirimkan informasi tentang jumlah percobaan login yang gagal dan waktu terakhir percobaan login yang gagal
        {
          validation_error: {
            timestamp: new Date().toISOString(),
            attemptCount: attemptsLOGIN[usedEmail].attemptCount,
          },
        }
      );
    }

    // Reset login attempts apabila login berhasil
    delete attemptsLOGIN[usedEmail];

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
