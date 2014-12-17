var manageUsers       = require('../controller/ManageUsers');

module.exports = function(app, passport) {

  app.get('/', isLoggedIn, function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // Login
  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/dashboard', // redirect to dashboard
    failureRedirect : '/login', // redirect back to the signup page if there is an error
  }));

  // Signup
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/dashboard', // redirect to dashboard
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // Profile
  app.get('/dashboard', isLoggedIn, function(req, res) {
    if (req.user.local.isAdmin) {
      res.render('admin.ejs', {
        user : req.user // get the user out of session and pass to template
      });
    }
    else {
      res.render('profile.ejs', {
        user : req.user // get the user out of session and pass to template
      });
    }

  });

  // Logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

// Buyer
app.get('/buyer', function(req, res) {
  res.render('buyer.ejs');
});

// Seller
app.get('/seller', function(req, res) {
  res.render('seller.ejs');
});

// Profile
app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', {
    user: req.user
  });
});


app.get('/Users', isLoggedIn, function(req, res){
  // Allow only for admins
  if (req.user.local.isAdmin) {
    var allUsers = [];
    var queryStatus = req.query.status;
    // status 0: Pending, 1: Approved
    if (typeof queryStatus !== 'undefined' ) {
      manageUsers.getUsersFilterByStatus(queryStatus, function(err, users){
        if (err) {
          res.sendStatus(400);
        }
        else {
          users.forEach(function(usr){
            var individual = {
              id: usr._id,
              email: usr.local.email,
              status: usr.local.status,
              isAdmin: usr.local.isAdmin
            };

            allUsers.push(individual);
          });

          // send the users
          res.json(allUsers);
        }
      });
    }else {
      manageUsers.getAllUsers(function(err, users){
        if (err) {
          res.sendStatus(400);
        }
        else {
          users.forEach(function(usr){
            var individual = {
              id: usr._id,
              email: usr.local.email,
              status: usr.local.status,
              isAdmin: usr.local.isAdmin
            };

            allUsers.push(individual);
          });

          // send the users
          res.json(allUsers);
        }
      }); // getAllUsers
    }

  }
  else {
    res.sendStatus(401);
  }
})

app.post('/Users', isLoggedIn, function(req, res){
  // Allow only for admins
  if (req.user.local.isAdmin) {
    var usersIdsToApprove = req.body.usersIdsToApprove;
    console.log(usersIdsToApprove);
    if (typeof usersIdsToApprove !== 'undefined') {
      manageUsers.approveUsers(usersIdsToApprove, function(err, dat){
        if (err) {
          res.sendStatus(400);
        }
        else{
          res.json(dat);
        }
      })
    }
    else{
      res.sendStatus(400);
    }
  }
  else {
    res.sendStatus(401);
  }
})
// Middleware
function isLoggedIn(req, res, next) {

  // if user is authenticated go ahead
  if (req.isAuthenticated())
    return next();

    // else redirect
    res.redirect('/login');
  }
