var mongoose            = require('mongoose'),
    User                = require('./user');

var auctionSchema = mongoose.Schema({
    auctionName: String,
    auctionDescription: String,
    auctionDateOfAuction: String,
    auctionItems: [{
        name: String,
        description: String,
        currency: String,
        floorPrice: String,
        minimumIncrement: String,
        quantity: Number,
        startTime: String,
        endTime: String,
        isActive: { type: Boolean, default: true}, // Admin can make an auction item active/ inactive
        itemState: {type: Number, default: 0}, // 0: Not Started, 1: Completed, 2: In Progress
        biddingData: [{
            // There can be multiple bidding for the same item, till the item is sold
            itemStateAfterBidding: {type: Number, default: 0}, // 0: unsold, 1: sold
            winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            purchasedQuantity: {type: Number, default: 0},
            purchasedPrice: { type: String, default: '0'}
        }]
    }],
    auctionCreatedBy: String,
    auctionCreatedDate: {type: Date, default: Date.now},
    isActive: { type: Boolean, default: true}, // Admin can make an auction active/ inactive
    auctionState: {type: Number, default: 0} // 0: Not Started, 1: Completed, 2: In Progress
});

module.exports = mongoose.model('Auction', auctionSchema);