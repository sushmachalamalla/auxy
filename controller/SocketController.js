exports.SocketController = function(app, io){
    var BIDS = [];

    function BidData(usr, amnt, sock) {
        this.user = usr;
        this.bidAmount = amnt;
        this.socket = sock;
    }

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

        // Admin Channel
        socket.on('AdminAuctionChannel', function(data){

        });

        // Regular User Channel
        socket.on('UserAuctionChannel', function(data){

        });
    });

};