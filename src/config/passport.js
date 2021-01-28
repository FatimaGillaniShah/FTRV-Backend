import passport from 'passport';
import LocalStrategy from 'passport-local';
import passwordUtil from '../utils/passwordUtil';
import models from '../models';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'user[email]',
      passwordField: 'user[password]',
    },
    async (email, passwordParam, done) => {
      const { User, Role } = models;
      // Hash user supplied password and find user
      const password = passwordUtil.generateHash(passwordParam);
      let user;
      try {
        user = await User.findOne({
          where: {
            email,
            password,
          },
          include: [
            {
              model: Role,
            },
          ],
        });
      } catch (error) {
        return done(null, false, { error });
      }
      if (!user) {
        return done(null, false, { errors: { account: 'Invalid credentials' } });
      }

      // Validate password
      // if ( !validatePassword(password, user.password) ) {
      // 	return done(null, false, { errors: { 'password': 'Password is invalid'}});
      // }

      return done(null, user);
    }
  )
);
