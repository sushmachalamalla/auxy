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

var BIDS = [];

function BidData(usr, amnt, sock) {
        this.user = usr;
        this.bidAmount = amnt;
        this.socket = sock;
    }
    // SOCKET IO
io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('Bids', function(msg) {
        console.log('user: ' + msg.user + ' bidAmount: ' + msg.bidAmount);
        var dat = new BidData(msg.user, msg.bidAmount, socket.id);
        // Add/update data according to user
        if (BIDS.length === 0) {
            BIDS.push(dat);
        } else {
            for (var i = 0; i < BIDS.length; i++) {
                if (BIDS[i].user == msg.user) {
                    BIDS[i].bidAmount = msg.bidAmount;
                    break;
                } else {
                    if (i == BIDS.length - 1) {
                        BIDS.push(dat);
                        break;
                    }
                }
            } //for
        }
        console.log('------------');
        var sorted = BIDS.sort(function(a, b) {
            return parseInt(b.bidAmount) - parseInt(a.bidAmount);
        });
        console.log(sorted);
        // emit the rank to individuals
        for (var j =0; j < BIDS.length; j++){
            var id = BIDS[j].socket;
            console.log('[USER]: '+ msg.user + " [RANK]: " + parseInt(j)+1 + " [SOCK]: " + id);
            var usrSock = io.sockets.connected[id];
            var message = {
                rank: parseInt(j)+1 ,
                bidvalue: BIDS[j].bidAmount
            }
            if (typeof usrSock != 'undefined') {
                 usrSock.emit("rank", message);
            }

        }

    });
});
http.listen(8000, function() {
    console.log('listening on *:8000');
});
