var mongoose            = require('mongoose'),
    User                = require('./user'),
    Auction             = require('./auction');

var AuctionParticipationSchema = mongoose.Schema({
    requestedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    auction: {type: mongoose.Schema.Types.ObjectId, ref: 'Auction'},
    message: {type: String, default: ''},
    isApproved: {type: Boolean, default: false}
});

module.exports = mongoose.model('AuctionParticipation', AuctionParticipationSchema);