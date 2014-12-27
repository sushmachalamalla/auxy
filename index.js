var express                 = require('express'),
    app                     = express(),
    http                    = require('http').Server(app),
    io                      = require('socket.io')(http),
    mongoose                = require('mongoose'),
    passport                = require('passport'),
    cookieParser            = require('cookie-parser'),
    bodyParser              = require('body-parser'),
    session                 = require('express-session'),
    flash                   = require('connect-flash'),
    signature               = require('cookie-signature'),
    cookie                  = require('cookie'),
    passportSocketIo        = require("passport.socketio");

var configDB                = require('./config/database.js'),
    store                   = new session.MemoryStore(),
    secret                  = 'IrisBitGUID',
    name                    = 'connect.sid';
mongoose.connect(configDB.url);
require('./config/passport')(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); 

app.set('view engine', 'ejs');

// required for passport
app.use(session({
        name: name,
        cookie: {expires: new Date(Date.now() + 30*60*60*24*1000)},
        secret: secret,
        store: store,
        resave: false,
         saveUninitialized: true
    })
        );
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
app.use('/public', express.static(__dirname + "/public"));
require('./app/routes.js')(app, passport);

// SOCKET IO
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key:         name,
    secret:      secret,
    store:       store,
    success:     onAuthorizeSuccess,
    fail:        onAuthorizeFail

}));
function onAuthorizeSuccess(data, accept){
    console.log('successful connection to socket.io');
    accept();
}

function onAuthorizeFail(data, message, error, accept){
    if(error)
        accept(new Error(message));
}

var socketController = require('./controller/SocketController');
socketController.SocketController(app, io, cookie, name, secret ,signature, store);

http.listen(8000, function() {
    console.log('listening on *:8000');
});
