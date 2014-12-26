var BIDS = [];
exports.SocketController = function(app, io, cookie, name, secret, signature, store){


    function BidData(usr, amnt, sock) {
        this.userSessionId = usr;
        this.bidAmount = amnt;
    }

    io.on('connection', function(socket) {
        if (socket.handshake && socket.handshake.headers && socket.handshake.headers.cookie) {
            var raw = cookie.parse(socket.handshake.headers.cookie)[name];
            if (raw) {
                // The cookie set by express-session begins with s: which indicates it
                // is a signed cookie. Remove the two characters before unsigning.
                socket.sessionId = signature.unsign(raw.slice(2), secret) || undefined;
            }
        }
        if (socket.sessionId) {
            //store.get(socket.sessionId, function(err, session) {
            //    console.log('[Session] '+session);
            //});
        }

        console.log('[Connected] [SessionID] = %s [SockedID] = %s ', socket.sessionId, socket.id);

        var uniqueID = socket.sessionId;
        socket.join(uniqueID);

        socket.on('disconnect', function() {
            console.log('[Disconnected] [SessionID] = %s [SockedID] = %s ', socket.sessionId, socket.id);
            //socket.leave(socket.sessionId); //socket will auto leave on disconnection
        });

        socket.on('Bids', function(msg) {
            var dat = new BidData(uniqueID, msg.bidAmount);

            // Add/update data according to user
            upsertData(dat);
            //if (BIDS.length === 0) {
            //    BIDS.push(dat);
            //} else {
            //    for (var i = 0; i < BIDS.length; i++) {
            //        if (BIDS[i].user == msg.user) {
            //            BIDS[i].bidAmount = msg.bidAmount;
            //            break;
            //        } else {
            //            if (i == BIDS.length - 1) {
            //                BIDS.push(dat);
            //                break;
            //            }
            //        }
            //    } //for
            //}

            console.log('------------');

            var sorted = BIDS.sort(function(a, b) {
                return parseInt(b.bidAmount) - parseInt(a.bidAmount);
            });
            console.log(sorted);

            // emit the rank to individuals
            for (var j =0; j < BIDS.length; j++){
                var sessionId = BIDS[j].userSessionId;
                console.log('[USER Session ID]: '+ sessionId + " [RANK]: " + (parseInt(j) + 1));
                //var usrSock = io.sockets.connected[id];
                var message = {
                    rank: (parseInt(j)+1) ,
                    bidvalue: BIDS[j].bidAmount
                };
                //if (typeof usrSock != 'undefined') {
                //    usrSock.emit("rank", message);
                //}
                io.to(sessionId).emit('rank', message);

            }

        });

        // Admin Channel
        socket.on('AdminAuctionChannel', function(data){

        });

        // Regular User Channel
        socket.on('UserAuctionChannel', function(data){

        });


    });

    var upsertData = function(data){
        var exists = false;
        var i = 0;

        while( i < BIDS.length){
            if(BIDS[i].userSessionId == data.userSessionId){
                BIDS[i].bidAmount = data.bidAmount;
                exists = true;
                break;
            }
            i++;
        }

        if(!exists){
            BIDS.push(data);
        }
    }

};