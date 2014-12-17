var LocalStrategy       = require('passport-local').Strategy,
    User                = require('../app/models/user');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // pass the entire request to the callback
  },
  function(req, email, password, done) {

    if (!validateEmail(email)) {
      return done(null, false, req.flash('signupMessage', 'Please enter a valid email address'));
    }

    // check if user exists
    User.findOne({ 'local.email' :  email }, function(err, user) {
      // if there are any errors, return the error
      if (err)
        return done(err);

        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {

          // create the user
          var newUser            = new User();

          newUser.local.email    = email;
          newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model

          // save the user
          newUser.save(function(err) {
            if (err)
              throw err;
              return done(null, newUser);
            });
          }

        });

      }));


      passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // pass the entire request to the callback
      },
      function(req, email, password, done) {

        // check if user exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
          if (err)
            return done(err);

            if (!user)
              return done(null, false, req.flash('loginMessage', 'No user found.'));

              // check password
              if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // success
                return done(null, user);
              });

            }));

          };

          function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
          }
