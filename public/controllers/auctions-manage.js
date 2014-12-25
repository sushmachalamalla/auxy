var adminAuctionsManage = angular.module('admin-auctions-manage', ['ngRoute']);

// Admin Auctions Manage
adminAuctionsManage.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/auctions/manage?id',
        {
            templateUrl: "admin-auctions-manage.ejs.html",
            controller: "auctionManageController"
        })
}]);

adminAuctionsManage.controller('auctionManageController', ['$scope', '$rootScope', '$routeProvider', function($scope, $rootScope, $routeProvider){
    $scope.auctionId = $routeProvider.id;
    getAuctionData($routeProvider.id);
}]);

var getAuctionData = function(auctionId, callback){
    if(typeof auctionId !== 'undefined' && auctionId !== ''){
        $.ajax({
            url: '/api/auctions/auction?id=' + auctionId,
            type: 'GET',
            success: function(data){
                console.log(data);
                callback(null, data);
            },
            error: function(request, status, error){
                callback(error, null);
            }
        })
    }
};