const Admin = require('../Models/adminModel')
const passportJWT = require('passport-jwt')


let jwtOptions = {
    secretOrKey: process.env.SECRET,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = new passportJWT.Strategy(jwtOptions, async(jwtPayload, done) => {
    await Admin.findById(jwtPayload.user_id)
        .then(user => {
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        })
        .catch(err => {
            return done(null, err);
        });
})