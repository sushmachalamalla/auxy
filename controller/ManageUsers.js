var User                = require('../app/models/user');

// returns all the users
exports.getAllUsers = function(callback){
  User.find({}, function(err, users){
    callback(err, users);
  })
};

exports.getUsersFilterByStatus = function(status, callback){
  User.find({'local.status': status}, function(err, users){
    callback(err, users);
  })
};

exports.approveUsers = function(userIds, callback){
  User.update({_id: {$in: userIds}},
    {$set: {'local.status': 1}},
    { multi: true },
    function(err, numberEffected){
      callback(err, numberEffected);
    })
}
