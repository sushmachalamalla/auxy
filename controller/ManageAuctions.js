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

// Get details of a single auction
exports.getAuctionDetails = function(auctionId, isAdmin, callback){
    Auction.findOne({_id: auctionId }, function(err, auction){
        if(err){
            callback(err, null);
        } else {
            if(isAdmin){
                // send all data
                callback(null, auction);
            } else {
                //TODO: Optimize this
                // Remove 1. biddingData in auctionItems
                if(typeof auction.auctionItems !== 'undefined' && auction.auctionItems.length > 0){
                    auction.auctionItems.forEach(function(item, index, object){
                        if(typeof item.biddingData !== 'undefined'){
                            object[index].biddingData.pop();
                            object[index].biddingData.push('a');
                        }
                    });
                }

                // Remove 2. approvedUsers in auction
                auction.approvedUsers = [];

                callback(null, auction);
            }
        }
    })
};
