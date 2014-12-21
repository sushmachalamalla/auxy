var Auction                = require('../app/models/auction');

// Create auction
exports.createAuction = function(auctionData, callback){
    if(typeof auctionData !== 'undefined'){
        var auction = new Auction();
        auction.auctionName = auctionData.auctionName;
        auction.auctionDescription = auctionData.auctionDescription;
        auction.auctionDateOfAuction = auctionData.auctionDateOfAuction;
        auction.auctionItems = auctionData.auctionItems;
        auction.auctionCreatedBy = auctionData.auctionCreatedBy;
        auction.save(function(err, data){
            if(err){
                callback(err, null);
            }
            else{
                callback(null, data);
            }

        });
    }
    else {
        callback(null, null);
    }
};

// Get auctions
exports.getAuctions = function(data, callback){
    Auction.find({})
        .sort({auctionCreatedDate: 'desc'})
        .exec(function(err, doc){
            if(err){
                callback(err, null);
            }
            callback(null, doc);
        })
};