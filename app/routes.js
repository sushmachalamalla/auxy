var manageUsers                   = require('../controller/ManageUsers'),
    manageAuctions                = require('../controller/ManageAuctions'),
    manageAuctionParticipation    = require('../controller/ManageAuctionParticipation');

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
    failureFlash : true
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

  app.get('/auctions', isLoggedIn, function(req, res){
// if its admin, render admin-auctions
    if (req.user.local.isAdmin) {
      res.render('admin-auctions.ejs', {
        user: req.user
      });
    }
    else {
      res.render('regular-auctions.ejs', {
        user: req.user
      });
    }
// else render regular-auctions
  }); // get /auctions

  // Auctions Manage
  app.get('/auctions/manage', isLoggedIn, function(req, res){

    //Check if auction id is provided
    if(typeof req.query.id === 'undefined' || req.query.id === ''){
      res.sendStatus(400);
    }
    else if(req.user.local.isAdmin){
      // render admin-auctions-manage.ejs
      res.render('admin-auctions-manage.ejs', {
        user: req.user,
        data: {
          auctionId: req.query.id,
          isAllowedForAuction: true
        }
      });
    } else{

      // check if user allowed for this auction
      manageAuctionParticipation.checkUserApproval(req.query.id, function(err, data){
        var isApproved = false;
          if(typeof data !== 'undefined' && data != null){
            isApproved = data.isApproved
          }
        // render regular-auctions-manage.ejs
        res.render('regular-auctions-manage.ejs', {
          user: req.user,
          data: {
            auctionId: req.query.id,
            isAllowedForAuction: isApproved
          }

        });

      });
    }

  });
  /* API Methods */
  app.get('/api/users', isLoggedIn, function(req, res){
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
  });

  app.post('/api/users', isLoggedIn, function(req, res){
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
  });

  app.get('/api/auctions', isLoggedIn, function(req, res){
    manageAuctions.getAuctions(null,function(err, data){
      if (err) {
        res.sendStatus(400);
      }
      else{
        res.json(data);
      }
    })
  });

  app.post('/api/auctions', isLoggedIn, function(req, res){
    // Allow only for admins
    if (req.user.local.isAdmin) {
      var auctionData = req.body.auctionInfo;
      if (typeof auctionData !== 'undefined') {

        // add createdBy field
        auctionData.auctionCreatedBy = req.user.local.email;
        manageAuctions.createAuction(auctionData, function(err, data){
          if (err) {
            res.sendStatus(400);
          }
          else{
            res.json(data);
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
  });

  app.get('/api/auctions/auction', isLoggedIn, function(req, res){
    // anyone can request to get details of a particular auction
    // but if requester is admin send additional data, else filter to few
    if(typeof req.query.id === 'undefined' || req.query.id === ''){
      res.sendStatus(400);
    } else {
      manageAuctions.getAuctionDetails(req.query.id, req.user.local.isAdmin, function(err, data){
        if(err){
          res.json({});
        } else {
          res.send(data);
        }
      });
    }
  });

  // get all users requesting to participate in an auction
  app.get('/api/auctions/auction/request', isLoggedIn, function(req, res){
    // only admin can view
    if(req.user.local.isAdmin){
      if(typeof req.query.id === 'undefined' || req.query.id === ''){
        res.sendStatus(400);
      } else {
        var userData = {
          userId: req.user._id,
          auctionId: req.query.id
        };
        manageAuctionParticipation.getAuctionParticipationRequests(userData, function(err, data){
          if(err){
            res.sendStatus(400);
          } else {
            res.send(data);
          }
        })
      }
    }
    else {
      res.sendStatus(403);
    }
  });

  // a user can opt to participate in an auction
  app.post('/api/auctions/auction/request', isLoggedIn, function(req, res){
    if(typeof req.query.id === 'undefined' || req.query.id === ''){
      res.sendStatus(400);
    } else {
      var userData = {
        userId: req.user._id,
        auctionId: req.query.id,
        message: req.body.message || ''
      };
      manageAuctionParticipation.createRequest(userData, function(err, data){
        if(err){
          res.sendStatus(400);
        } else {
          res.json({saved: true});
        }
      })
    }
  });

  // an admin can approve or reject a request
  app.put('/api/auctions/auction/request', isLoggedIn, function(req, res){
    // Only for admin
    if(req.user.local.isAdmin){
      if(typeof req.body.requestData === 'undefined' ){
        res.sendStatus(400);
      } else {
        manageAuctionParticipation.manageRequests(req.body.requestData, function(err, data){
          if(err){
            res.sendStatus(400);
          } else {
            res.json({saved: true});
          }
        })
      }
    }
    else {
      res.sendStatus(403);
    }

  });

  // an Admin can change the auction state
  app.post('/api/auctions/auction/ChangeAuctionState', isLoggedIn, function(req, res){
    // only admin can issue this request
    if(req.user.local.isAdmin){
      if(typeof req.query.id === 'undefined' && req.query.id === '' && typeof req.query.auctionState === 'undefined' && req.query.auctionState === ''){
        res.sendStatus(400);
      } else {
        var userData = {
          auctionId: req.query.id,
          auctionState: req.query.auctionState || 0
        };
        manageAuctions.changeAuctionState(userData, function(err, data){
          if(err){
            res.sendStatus(400);
          } else {
            res.json({saved: true});
          }
        })
      }
    } else {
      res.sendStatus(403);
    }
  });

  // an Admin can change the auction Item state
  app.post('/api/auctions/auction/ChangeAuctionItemState', isLoggedIn, function(req, res){
    // only admin can issue this request
    if(req.user.local.isAdmin){
      if(typeof req.query.id === 'undefined' && req.query.id === ''
          && typeof req.query.itemId === 'undefined' && req.query.itemId === ''
          && typeof req.query.auctionItemState === 'undefined' && req.query.auctionItemState === ''){
        res.sendStatus(400);
      } else {
        var userData = {
          auctionId: req.query.id,
          auctionItemId: req.query.itemId,
          auctionItemState: req.query.auctionItemState || 0
        };
        manageAuctions.changeAuctionItemState(userData, function(err, data){
          if(err){
            res.sendStatus(400);
          } else {
            res.json({saved: true});
          }
        })
      }
    } else {
      res.sendStatus(403);
    }
  });

};


// Middleware
function isLoggedIn(req, res, next) {

  // if user is authenticated go ahead
  if (req.isAuthenticated())
    return next();

    // else redirect
    res.redirect('/login');
  }
