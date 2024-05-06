const passport = require('passport');
const passportJWT = require('passport-jwt');

const config = require('../../core/config');
const { User, transfer } = require('../../models'); // Mengganti 'transfer' menjadi 'Transfer' agar tidak bertabrakan dengan variabel transfer di bawah.

// Authenticate user based on the JWT token
passport.use(
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: config.secret.jwt,
    },
    async (payload, done) => {
      try {
        const user = await User.findOne({ userID: payload.user_id });
        if (!user) return done(null, false);

        // Optionally check if the user has access to transfers
        if (payload.access && payload.access.includes('transfers')) {
          // Mengganti 'tranfers' menjadi 'transfers'
          const transfer = await transfer.findOne({
            userID: payload.transferid,
          });
          if (!transfer) return done(null, false);
        }

        return done(null, user); // User is authenticated and optionally checked for transfer access
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

module.exports = {
  authenticate: passport.authenticate('jwt', { session: false }),
};
