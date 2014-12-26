var AuctionParticipation                = require('../app/models/AuctionParticipation');

exports.createRequest = function(userData, callback){
    if(typeof userData !== 'undefined'){
        var auctionParticipation = {
            requestedBy : userData.userId,
            auction : userData.auctionId,
            message : userData.message,
            isApproved : false
        };

        AuctionParticipation.update({'auction' : userData.auctionId}, auctionParticipation, { upsert: true}, function(err, numberEffected){
            if(err){
                callback(err, null);
            }
            else{
                callback(null, numberEffected);
            }
        });
    }
    else {
        callback({}, null);
    }
};

exports.getAuctionParticipationRequests = function(userData, callback){
    if(typeof userData !== 'undefined'){
        AuctionParticipation.find({ auction: userData.auctionId })
            .populate('auction')
            .populate('requestedBy')
            .exec(function(err, doc){
                var response = [];
                if(err){
                    callback(err, response);
                } else {
                    doc.forEach(function(item, index, arr){
                        responseBody = {
                            requestId: item._id,
                            requestedBy: item.requestedBy.local.email,
                            isApproved: item.isApproved,
                            message: item.message
                        }
                        response.push(responseBody);
                    });
                    callback(null, response);
                }

            })
    } else {
        callback({}, []);
    }
};

// approve or reject a request
exports.manageRequests = function(requestData, callback){
    if(typeof requestData !== 'undefined' ){

        requestData.approved = typeof requestData.approved === 'undefined' ? [] : requestData.approved;

        var query = {"_id": {"$in" : requestData.approved}};
        var update = {"isApproved": true};
        var options = {new: false};
        AuctionParticipation.update(query, update, options, function(err, data) {
            if (err) {
                console.log(err);
                //callback(err, null);
            }
            else {
                //callback(null, data);
            }
        });

        requestData.unapproved = typeof requestData.unapproved === 'undefined' ? [] : requestData.unapproved;

        query =  {"_id": {"$in" : requestData.unapproved}};
        update = {"isApproved": false};
        options = {new: false};
        AuctionParticipation.update(query, update, options, function(err, data) {
            if (err) {
                console.log(err);
                //callback(err, null);
            }
            else {
                //callback(null, data);
            }
        });

        // TODO check if both updates completed or not
        callback(null, {});
    }
    else {
        callback({}, null);
    }
};

// check if user is approved or rejected
exports.checkUserApproval = function(auctionId, callback){
    if(typeof auctionId !== 'undefined' && auctionId !== '' ){
        AuctionParticipation.findOne({auction: auctionId}, function(err, dat){
            callback(err, dat);
        })
    }
};