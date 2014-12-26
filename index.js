var express                 = require('express'),
    app                     = express(),
    http                    = require('http').Server(app),
    io                      = require('socket.io')(http),
    mongoose                = require('mongoose'),
    passport                = require('passport'),
    cookieParser            = require('cookie-parser'),
    bodyParser              = require('body-parser'),
    session                 = require('express-session'),
    flash                   = require('connect-flash');

var configDB                = require('./config/database.js');
mongoose.connect(configDB.url);
require('./config/passport')(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); 

app.set('view engine', 'ejs');

// required for passport
app.use(session({ secret: 'IrisBitGUID',
                  resave: false,
                  saveUninitialized: true
                })
        ); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
app.use('/public', express.static(__dirname + "/public"));
require('./app/routes.js')(app, passport);

// SOCKET IO
var socketController = require('./controller/SocketController');
socketController.SocketController(app, io);

http.listen(8000, function() {
    console.log('listening on *:8000');
});
