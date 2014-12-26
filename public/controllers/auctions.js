var adminAuctions = angular.module('admin-auctions', []);
var adminAuctionsManage = angular.module('admin-auctions-manage', []);

adminAuctions.controller('auctionsWizardController',['$scope', '$rootScope' , '$http', function ($scope, $rootScope, $http) {
    var sortableEle;
    $scope.auctionItems = [];

    $scope.currencyList = commonCurrencyList();

    $scope.addItemToAuction = function(){
        var isValid = true;
        //validate
        if(typeof $scope.itemName === 'undefined' || $scope.itemName === ''){
            $('#inputItemName').parent().removeClass('has-success').addClass('has-error');
            isValid &= false;
        }
        else{
            $('#inputItemName').parent().removeClass('has-error');
            isValid &= true;
        }


        if(typeof $scope.itemCurrency === 'undefined' || $scope.itemCurrency === ''){
            $('#inputItemCurrency').parent().removeClass('has-success').addClass('has-error');
            isValid &= false;
        }
        else{
            $('#inputItemCurrency').parent().removeClass('has-error');
            isValid &= true;
        }



        if(typeof $scope.itemFloorPrice === 'undefined' || $scope.itemFloorPrice === ''){
            $('#inputItemFloorPrice').parent().removeClass('has-success').addClass('has-error');
            isValid &= false;
        }
        else{
            $('#inputItemFloorPrice').parent().removeClass('has-error');
            isValid &= true;
        }




        if(typeof $scope.itemMinimumIncrement === 'undefined' || $scope.itemMinimumIncrement === ''){
            $('#inputItemMinimumIncrement').parent().removeClass('has-success').addClass('has-error');
            isValid &= false;
        }
        else{
            $('#inputItemMinimumIncrement').parent().removeClass('has-error');
            isValid &= true;
        }


        if(typeof $scope.itemQuantity === 'undefined' || $scope.itemQuantity === ''){
            $('#inputItemQuantity').parent().removeClass('has-success').addClass('has-error');
            isValid &= false;
        }
        else{
            $('#inputItemQuantity').parent().removeClass('has-error');
            isValid &= true;
        }


        if(typeof $scope.itemStartTime === 'undefined' || $scope.itemStartTime === ''){
            $('#inputStartTime').parent().removeClass('has-success').addClass('has-error');
            isValid &= false;
        }
        else{
            $('#inputStartTime').parent().removeClass('has-error');
            isValid &= true;
        }


        if(typeof $scope.itemEndTime === 'undefined' || $scope.itemEndTime === ''){
            $('#inputEndTime').parent().removeClass('has-success').addClass('has-error');
            isValid &= false;
        }
        else{
            $('#inputEndTime').parent().removeClass('has-error');
            isValid &= true;
        }

        var alertHTML="";
        if (isValid){
            // Save
            $scope.auctionItems.push({
                name: $scope.itemName,
                description: $scope.itemDescription,
                currency: $scope.itemCurrency,
                floorPrice: $scope.itemFloorPrice,
                minimumIncrement: $scope.itemMinimumIncrement,
                quantity: $scope.itemQuantity,
                startTime: $scope.itemStartTime,
                endTime: $scope.itemEndTime
            });

            alertHTML += "            <div class=\"alert alert-success alert-dismissible\" role=\"alert\">";
            alertHTML += "              <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;<\/span><span class=\"sr-only\">Close<\/span><\/button>";
            alertHTML += "              <strong>Success!<\/strong> Changes for <strong>"+ $scope.itemName +"<\/strong> saved successfully.";
            alertHTML += "            <\/div>";

            $('#saveAlert').html(alertHTML);
            $("#saveAlert").fadeTo(2000, 4000).slideUp(2000, function(){
                $("#saveAlert").alert('close');
            });

            // Clear the controls
            $scope.itemName = "";
            $scope.itemDescription = "";
            $scope.itemCurrency = $scope.currencyList[0];
            $scope.itemFloorPrice = "";
            $scope.itemMinimumIncrement = "";
            $scope.itemQuantity = "";
            $scope.itemStartTime = "";
            $scope.itemEndTime = "";

        }
        else {
            alertHTML += "            <div class=\"alert alert-danger alert-dismissible\" role=\"alert\">";
            alertHTML += "              <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;<\/span><span class=\"sr-only\">Close<\/span><\/button>";
            alertHTML += "              <strong>Error!<\/strong> Please correct the errors before saving the changes.";
            alertHTML += "            <\/div>";

            $('#saveAlert').html(alertHTML);
            $("#saveAlert").fadeTo(2000, 4000).slideUp(2000, function(){
                $("#saveAlert").alert('close');
            });
            $rootScope.$broadcast("timeLineRefresh", {});
        }

    };

    $scope.removeItemFromAuction = function(item){
        var index = $scope.auctionItems.indexOf(item);
        $scope.auctionItems.splice(index,1);
    };

    $scope.sendAuctionInfoToServer = function(){
        var auctionData = {
            auctionName: $scope.auctionName,
            auctionDescription: $scope.auctionDescription,
            auctionDateOfAuction: $scope.auctionDateOfAuction,
            auctionItems: $scope.auctionItems
        };

        var alertHTML="";
        if(typeof auctionData === 'undefined' || auctionData.auctionItems.length < 1 || auctionData.auctionName === '' || auctionData.auctionDateOfAuction === ''){
            alertHTML += "            <div class=\"alert alert-danger alert-dismissible\" role=\"alert\">";
            alertHTML += "              <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;<\/span><span class=\"sr-only\">Close<\/span><\/button>";
            alertHTML += "              <strong>Oops!<\/strong> Looks like you need to recheck the information you provided :) ";
            alertHTML += "            <\/div>";

            $('#finishAlert').html(alertHTML);
            $("#finishAlert").fadeTo(2000, 4000).slideUp(2000, function(){
                $("#finishAlert").alert('close');
            });
            return;
        }

        $.ajax({
            url: '/api/auctions',
            type: 'POST',
            data:  {auctionInfo: auctionData },
            contentType: "application/x-www-form-urlencoded",
            success: function(data){
                alertHTML += "            <div class=\"alert alert-success alert-dismissible\" role=\"alert\">";
                alertHTML += "              <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;<\/span><span class=\"sr-only\">Close<\/span><\/button>";
                alertHTML += "              <strong>Success!<\/strong> Auction <strong>"+ $scope.auctionName +"<\/strong> created successfully.";
                alertHTML += "            <\/div>";

                $('#finishAlert').html(alertHTML);
                $("#finishAlert").fadeTo(2000, 2000).slideUp(1000, function(){
                    $("#finishAlert").alert('close');
                });

                // Clear the controls
                $scope.$apply(function(){
                    $scope.auctionName = "";
                    $scope.auctionDescription = "";
                    $scope.auctionDateOfAuction = "";
                    $scope.auctionItems = [];
                });

                // Call the timeLineRefresh event
                $rootScope.$broadcast("timeLineRefresh", {});
            },
            error: function(request, status, error){
                alertHTML += "            <div class=\"alert alert-danger alert-dismissible\" role=\"alert\">";
                alertHTML += "              <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;<\/span><span class=\"sr-only\">Close<\/span><\/button>";
                alertHTML += "              <strong>Failed!<\/strong> Auction <strong>"+ $scope.auctionName +"<\/strong> could not be save. Please check again!";
                alertHTML += "            <\/div>";

                $('#finishAlert').html(alertHTML);
                $("#finishAlert").fadeTo(2000, 2000).slideUp(2000, function(){
                    $("#finishAlert").alert('close');
                });
            }
        });
    };
    // Invokes the modal, that enables the user to edit the auction item
    $scope.invokeUpdateAuctionItemModal = function(item){
        $('#addEditItemModal').modal();
        $scope.$apply(function(){
            $scope.itemName = item.itemName + " changed";
        });

    };

    // updates the actual item
    $scope.updateItemFromAuction = function(actualItem, changedItem){
        var index = $scope.auctionItems.indexOf(actualItem);
        if(index >= 0) {
            var updatedItem = {
                name: changedItem.itemName,
                description: changedItem.itemDescription,
                currency: changedItem.itemCurrency,
                floorPrice: changedItem.itemFloorPrice,
                minimumIncrement: changedItem.itemMinimumIncrement,
                quantity: changedItem.itemQuantity,
                startTime: changedItem.itemStartTime,
                endTime: changedItem.itemEndTime
            };

            $scope.auctionItems[index] = updatedItem;
        }
    };

    $scope.dragStart = function(e, ui) {
        ui.item.data('start', ui.item.index());
    };
    $scope.dragEnd = function(e, ui) {
        var start = ui.item.data('start'),
            end = ui.item.index();

        $scope.auctionItems.splice(end, 0,
            $scope.auctionItems.splice(start, 1)[0]);

        $scope.$apply();
    };

    sortableEle = $('#sortable').sortable({
        start: $scope.dragStart,
        update: $scope.dragEnd
    });
}]);

adminAuctions.controller('auctionsTimeLineController',['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout){
    $scope.timeLineElements = [];
    $scope.lastRefreshText = "";
    $scope.lastRefreshElapsedSeconds = 0;
    var timer = {};
    // Event that listens for refresh calls of timeLine
    $rootScope.$on('timeLineRefresh', function(event, args){
        getAuctions(function(err, data){
            if(err){

            }
            else {
                $scope.$apply(function(){
                    $scope.timeLineElements = data;
                    $timeout.cancel(timer);
                    $scope.lastRefreshElapsedSeconds = 0;
                    updateLastRefreshText();
                });

            }
        });
    });

    // get the auctions
    getAuctions(function(err, data){
        if(err){

        }
        else {
            $scope.$apply(function(){
                $scope.timeLineElements = data;
                $timeout.cancel(timer);
                $scope.lastRefreshElapsedSeconds = 0;
                updateLastRefreshText();
            });

        }
    });

    $scope.timeLineRefresh = function(){
        getAuctions(function(err, data){
            if(err){

            }
            else {
                $scope.$apply(function(){
                    $scope.timeLineElements = data;
                    $timeout.cancel(timer);
                    $scope.lastRefreshElapsedSeconds = 0;
                    updateLastRefreshText();
                });

            }
        });
    };

    var updateLastRefreshText = function(){

        timer = $timeout(function(){
            var elapsedTime = ($scope.lastRefreshElapsedSeconds ++)/60;
            if(elapsedTime < 1){
                $scope.lastRefreshText = $scope.lastRefreshElapsedSeconds + ($scope.lastRefreshElapsedSeconds == 1 ? " second" : " seconds");
            }
            if(elapsedTime >= 1 && elapsedTime < 5){
                $scope.lastRefreshText = "about 5 minutes";
            }
            if(elapsedTime >= 5 && elapsedTime < 30){
                $scope.lastRefreshText = "about 30 minutes";
            }
            if (elapsedTime >= 30 && elapsedTime < 60) {
                $scope.lastRefreshText = "long time";
                $timeout.cancel(timer);
            }
            updateLastRefreshText();
        },1000)
    };

}]);

var commonCurrencyList = function(){
    // Credit: http://data.okfn.org/data/core/country-codes/r/country-codes.json
    return {
        "AED": "United Arab Emirates Dirham",
        "AFN": "Afghan Afghani",
        "ALL": "Albanian Lek",
        "AMD": "Armenian Dram",
        "ANG": "Netherlands Antillean Guilder",
        "AOA": "Angolan Kwanza",
        "ARS": "Argentine Peso",
        "AUD": "Australian Dollar",
        "AWG": "Aruban Florin",
        "AZN": "Azerbaijani Manat",
        "BAM": "Bosnia-Herzegovina Convertible Mark",
        "BBD": "Barbadian Dollar",
        "BDT": "Bangladeshi Taka",
        "BGN": "Bulgarian Lev",
        "BHD": "Bahraini Dinar",
        "BIF": "Burundian Franc",
        "BMD": "Bermudan Dollar",
        "BND": "Brunei Dollar",
        "BOB": "Bolivian Boliviano",
        "BRL": "Brazilian Real",
        "BSD": "Bahamian Dollar",
        "BTN": "Bhutanese Ngultrum",
        "BWP": "Botswanan Pula",
        "BYR": "Belarusian Ruble",
        "BZD": "Belize Dollar",
        "CAD": "Canadian Dollar",
        "CDF": "Congolese Franc",
        "CHF": "Swiss Franc",
        "CLF": "Chilean Unit of Account (UF)",
        "CLP": "Chilean Peso",
        "CNY": "Chinese Yuan",
        "COP": "Colombian Peso",
        "CRC": "Costa Rican Colón",
        "CUP": "Cuban Peso",
        "CVE": "Cape Verdean Escudo",
        "CZK": "Czech Republic Koruna",
        "DJF": "Djiboutian Franc",
        "DKK": "Danish Krone",
        "DOP": "Dominican Peso",
        "DZD": "Algerian Dinar",
        "EGP": "Egyptian Pound",
        "ETB": "Ethiopian Birr",
        "EUR": "Euro",
        "FJD": "Fijian Dollar",
        "FKP": "Falkland Islands Pound",
        "GBP": "British Pound Sterling",
        "GEL": "Georgian Lari",
        "GHS": "Ghanaian Cedi",
        "GIP": "Gibraltar Pound",
        "GMD": "Gambian Dalasi",
        "GNF": "Guinean Franc",
        "GTQ": "Guatemalan Quetzal",
        "GYD": "Guyanaese Dollar",
        "HKD": "Hong Kong Dollar",
        "HNL": "Honduran Lempira",
        "HRK": "Croatian Kuna",
        "HTG": "Haitian Gourde",
        "HUF": "Hungarian Forint",
        "IDR": "Indonesian Rupiah",
        "ILS": "Israeli New Sheqel",
        "INR": "Indian Rupee",
        "IQD": "Iraqi Dinar",
        "IRR": "Iranian Rial",
        "ISK": "Icelandic Króna",
        "JMD": "Jamaican Dollar",
        "JOD": "Jordanian Dinar",
        "JPY": "Japanese Yen",
        "KES": "Kenyan Shilling",
        "KGS": "Kyrgystani Som",
        "KHR": "Cambodian Riel",
        "KMF": "Comorian Franc",
        "KPW": "North Korean Won",
        "KRW": "South Korean Won",
        "KWD": "Kuwaiti Dinar",
        "KZT": "Kazakhstani Tenge",
        "LAK": "Laotian Kip",
        "LBP": "Lebanese Pound",
        "LKR": "Sri Lankan Rupee",
        "LRD": "Liberian Dollar",
        "LSL": "Lesotho Loti",
        "LTL": "Lithuanian Litas",
        "LVL": "Latvian Lats",
        "LYD": "Libyan Dinar",
        "MAD": "Moroccan Dirham",
        "MDL": "Moldovan Leu",
        "MGA": "Malagasy Ariary",
        "MKD": "Macedonian Denar",
        "MMK": "Myanma Kyat",
        "MNT": "Mongolian Tugrik",
        "MOP": "Macanese Pataca",
        "MRO": "Mauritanian Ouguiya",
        "MUR": "Mauritian Rupee",
        "MVR": "Maldivian Rufiyaa",
        "MWK": "Malawian Kwacha",
        "MXN": "Mexican Peso",
        "MYR": "Malaysian Ringgit",
        "MZN": "Mozambican Metical",
        "NAD": "Namibian Dollar",
        "NGN": "Nigerian Naira",
        "NIO": "Nicaraguan Córdoba",
        "NOK": "Norwegian Krone",
        "NPR": "Nepalese Rupee",
        "NZD": "New Zealand Dollar",
        "OMR": "Omani Rial",
        "PAB": "Panamanian Balboa",
        "PEN": "Peruvian Nuevo Sol",
        "PGK": "Papua New Guinean Kina",
        "PHP": "Philippine Peso",
        "PKR": "Pakistani Rupee",
        "PLN": "Polish Zloty",
        "PYG": "Paraguayan Guarani",
        "QAR": "Qatari Rial",
        "RON": "Romanian Leu",
        "RSD": "Serbian Dinar",
        "RUB": "Russian Ruble",
        "RWF": "Rwandan Franc",
        "SAR": "Saudi Riyal",
        "SBD": "Solomon Islands Dollar",
        "SCR": "Seychellois Rupee",
        "SDG": "Sudanese Pound",
        "SEK": "Swedish Krona",
        "SGD": "Singapore Dollar",
        "SHP": "Saint Helena Pound",
        "SLL": "Sierra Leonean Leone",
        "SOS": "Somali Shilling",
        "SRD": "Surinamese Dollar",
        "STD": "São Tomé and Príncipe Dobra",
        "SVC": "Salvadoran Colón",
        "SYP": "Syrian Pound",
        "SZL": "Swazi Lilangeni",
        "THB": "Thai Baht",
        "TJS": "Tajikistani Somoni",
        "TMT": "Turkmenistani Manat",
        "TND": "Tunisian Dinar",
        "TOP": "Tongan Paʻanga",
        "TRY": "Turkish Lira",
        "TTD": "Trinidad and Tobago Dollar",
        "TWD": "New Taiwan Dollar",
        "TZS": "Tanzanian Shilling",
        "UAH": "Ukrainian Hryvnia",
        "UGX": "Ugandan Shilling",
        "USD": "United States Dollar",
        "UYU": "Uruguayan Peso",
        "UZS": "Uzbekistan Som",
        "VEF": "Venezuelan Bolívar",
        "VND": "Vietnamese Dong",
        "VUV": "Vanuatu Vatu",
        "WST": "Samoan Tala",
        "XAF": "CFA Franc BEAC",
        "XCD": "East Caribbean Dollar",
        "XDR": "Special Drawing Rights",
        "XOF": "CFA Franc BCEAO",
        "XPF": "CFP Franc",
        "YER": "Yemeni Rial",
        "ZAR": "South African Rand",
        "ZMK": "Zambian Kwacha",
        "ZWL": "Zimbabwean Dollar"
    }
};

var getAuctions = function(callback){
    $.ajax({
        url: '/api/auctions',
        type: 'GET',
        contentType: 'application/json',
        success: function(data){
            callback(null, data);
        },
        error: function(request, status, error){
            callback(error, null);
        }
    })
};


adminAuctionsManage.controller('auctionManageController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout){
    $scope.auctionData = {};
    $scope.auctionData.participationRequests = {};
    var alertHTML="";
    $scope.$watch('auctionId', function(){
        getAuctionData($scope.auctionId, function(err, data){
            if(err){

            } else {
                console.log(JSON.stringify(data));
                $scope.$apply(function(){
                    $scope.auctionData = data;
                });

            }
        });
    });

    // Manage the auction process for the item passed
    $scope.manageAuctionForItem = function(item){
        var index = $scope.auctionData.auctionItems.indexOf(item);
        var displayTime = {
            minute: 0,
            second:0
        };

        // check if starting or stopping
        switch(item.itemState){
            case 0:
                console.log('Going to start');
                $scope.auctionData.auctionItems[index].meta.biddingSummaryText = "auction will be started";

                // disable till the process starts
                $scope.auctionData.auctionItems[index].meta.isStartDisabled = true;

                // start the timer count down of 0:30 before start
                var timer = {};
                countDownTimer(0,5, displayTime, timer, function(){

                    // after timer elapsed, start the auction for the item
                    changeAuctionItemState($scope.auctionData._id, item._id, 2, function(err, data){
                        if(err){
                            console.log(err);
                            $scope.$apply(function(){
                                $scope.auctionData.auctionItems[index].meta.isStartDisabled = false;
                            });
                        }else {
                            $scope.$apply(function(){
                                $scope.auctionData.auctionItems[index].meta.biddingSummaryText = "auction in progress";
                                $scope.auctionData.auctionItems[index].itemState = 2;
                                $scope.auctionData.auctionItems[index].meta.auctionForItemStarted = true;
                                $scope.auctionData.auctionItems[index].meta.isStartDisabled = false;
                            });
                        }

                    });

                });
                break;
            case 1:
                console.log('Stopped');
                break;
            case 2:
                console.log('Going to stop');
                // disable till the process starts
                $scope.auctionData.auctionItems[index].meta.isStartDisabled = true;
                // after timer elapsed, start the auction for the item
                changeAuctionItemState($scope.auctionData._id, item._id, 1, function(err, data){
                    if(err){
                        console.log(err);
                        $scope.$apply(function(){
                            $scope.auctionData.auctionItems[index].meta.isStartDisabled = false;
                        });
                    }else {
                        $scope.$apply(function(){
                            $scope.auctionData.auctionItems[index].meta.biddingSummaryText = "auction is completed";
                            $scope.auctionData.auctionItems[index].itemState = 1;
                            $scope.auctionData.auctionItems[index].meta.auctionForItemStarted = true;
                            $scope.auctionData.auctionItems[index].meta.isStartDisabled = false;
                        });
                    }

                });
                break;
            default :
                console.log('Invalid');
                break;
        }

        $scope.auctionData.auctionItems[index].meta.displayTime = displayTime;



    };

    var countDownTimer = function(minutes, seconds, displayTime, timer, callback){
        timer = $timeout(function(){
            console.log(minutes + " " + seconds);
            if(seconds >= 0){
                $scope.$apply(function(){
                    displayTime.minute = minutes;
                    displayTime.second = seconds;

                    countDownTimer(0,seconds - 1, displayTime, timer, callback);

                });
            } else {
                $timeout.cancel(timer);
                callback();
            }
        },1000);
    };

    $scope.submitAuctionRequestAccess = function(){

        $.ajax({
            url: '/api/auctions/auction/request?id=' + $scope.auctionId,
            type: 'POST',
            data: {message: $scope.auctionRequestAccessMessage},
            contentType: "application/x-www-form-urlencoded",
            success: function(data){
                alertHTML += "            <div class=\"alert alert-success alert-dismissible\" role=\"alert\">";
                alertHTML += "              <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;<\/span><span class=\"sr-only\">Close<\/span><\/button>";
                alertHTML += "              <strong>Success!<\/strong> Your request for auction <strong>"+ $scope.auctionData.auctionName +"<\/strong> has been sent";
                alertHTML += "            <\/div>";

                $('#submitAuctionRequestAccessAlert').html(alertHTML);
                $("#submitAuctionRequestAccessAlert").fadeTo(2000, 2000).slideUp(1000, function(){
                    $("#submitAuctionRequestAccessAlert").alert('close');
                });

                // Clear the controls
                $scope.$apply(function(){
                    $scope.auctionRequestAccessMessage = "";
                });

            },
            error: function(request, status, error){
                alertHTML += "            <div class=\"alert alert-danger alert-dismissible\" role=\"alert\">";
                alertHTML += "              <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;<\/span><span class=\"sr-only\">Close<\/span><\/button>";
                alertHTML += "              <strong>Failed!<\/strong> Your request for auction <strong>"+ $scope.auctionName +"<\/strong> could not be completed. Please try again!";
                alertHTML += "            <\/div>";

                $('#submitAuctionRequestAccessAlert').html(alertHTML);
                $("#submitAuctionRequestAccessAlert").fadeTo(2000, 2000).slideUp(2000, function(){
                    $("#submitAuctionRequestAccessAlert").alert('close');
                });
            }
        });
    };

    $scope.getAuctionParticipationRequests = function(){

        $scope.auctionData.participationRequests = {};
        $scope.auctionData.participationRequests.isLoaded = false;
        alertHTML = "";
        $('#requestsModal').modal();
        $.ajax({
            url: '/api/auctions/auction/request?id=' + $scope.auctionData._id,
            type: 'GET',
            contentType: 'application/json',
            success: function(data){
                $scope.$apply(function(){
                    $scope.auctionData.participationRequests.isLoaded = true;
                    $scope.auctionData.participationRequests.data = data;
                });
                if(data.length > 0) {
                    $scope.$apply(function(){
                        $scope.auctionData.participationRequests.areRequestsAvailable = true;
                    });

                } else {
                    alertHTML += "            <div class=\"alert alert-danger alert-dismissible\" role=\"alert\">";
                    alertHTML += "              <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;<\/span><span class=\"sr-only\">Close<\/span><\/button>";
                    alertHTML += "              <strong>Sweet!<\/strong> There are no requests for this auction";
                    alertHTML += "            <\/div>";

                    $('#requestsAccessAlert').html(alertHTML);
                    $("#requestsAccessAlert").fadeTo(15000, 15000).slideUp(2000, function(){
                        $("#requestsAccessAlert").alert('close');
                    });

                }
            },
            error: function( request, status, err) {
                alertHTML += "            <div class=\"alert alert-danger alert-dismissible\" role=\"alert\">";
                alertHTML += "              <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;<\/span><span class=\"sr-only\">Close<\/span><\/button>";
                alertHTML += "              <strong>Failed!<\/strong> Your request could not be completed. Please try again ";
                alertHTML += "            <\/div>";

                $('#requestsAccessAlert').html(alertHTML);
                $("#requestsAccessAlert").fadeTo(2000, 2000).slideUp(2000, function(){
                    $("#requestsAccessAlert").alert('close');
                });
            }
        })
    };

    $scope.submitAuctionRequestApprovals = function(){
        var approved = [];
        var unapproved = [];

        $scope.auctionData.participationRequests.data.forEach(function(item, index, arr){
            if(item.isApproved){
                approved.push(item.requestId);
            }
            else {
                unapproved.push(item.requestId);
            }
        });

        $.ajax({
            url: '/api/auctions/auction/request',
            type: 'PUT',
            contentType: "application/x-www-form-urlencoded",
            data: { requestData: {
                approved: approved,
                unapproved: unapproved
            }},
            success: function(data){
                alertHTML = "";
                alertHTML += "            <div class=\"alert alert-success alert-dismissible\" role=\"alert\">";
                alertHTML += "              <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;<\/span><span class=\"sr-only\">Close<\/span><\/button>";
                alertHTML += "              <strong>Success!<\/strong> Your approvals are sent successfully.";
                alertHTML += "            <\/div>";

                $('#requestsAccessAlert').html(alertHTML);
                $("#requestsAccessAlert").fadeTo(2000, 2000).slideUp(1000, function(){
                    $("#requestsAccessAlert").alert('close');
                });

                // Clear the controls
                $scope.$apply(function(){
                    $scope.auctionName = "";
                    $scope.auctionDescription = "";
                    $scope.auctionDateOfAuction = "";
                    $scope.auctionItems = [];
                });

                // Call the timeLineRefresh event
                $rootScope.$broadcast("timeLineRefresh", {});
            },
            error: function(request, status, error){
                alertHTML = "";
                alertHTML += "            <div class=\"alert alert-danger alert-dismissible\" role=\"alert\">";
                alertHTML += "              <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;<\/span><span class=\"sr-only\">Close<\/span><\/button>";
                alertHTML += "              <strong>Failed!<\/strong> Your approvals could not be saved. Please try again!";
                alertHTML += "            <\/div>";

                $('#requestsAccessAlert').html(alertHTML);
                $("#requestsAccessAlert").fadeTo(2000, 2000).slideUp(2000, function(){
                    $("#requestsAccessAlert").alert('close');
                });
            }
        })
    };

}]);

var getAuctionData = function(auctionId, callback){
    if(typeof auctionId !== 'undefined' && auctionId !== ''){
        $.ajax({
            url: '/api/auctions/auction?id=' + auctionId,
            type: 'GET',
            success: function(data){
                callback(null, data);
            },
            error: function(request, status, error){
                callback(error, null);
            }
        })
    }
};

var changeAuctionState = function(auctionId, auctionState, callback){
    $.ajax({
        url: '/api/auctions/auction/ChangeAuctionState?id=' + auctionId + '&auctionState=' + auctionState,
        type: 'POST',
        contentType: 'application/json',
        success: function(data){
            callback(null, data);
        },
        error: function(request, status, error){
            console.log(err);
            callback(error, null);
        }
    });
};

var changeAuctionItemState = function(auctionId, auctionItemId, auctionItemState, callback){
    $.ajax({
        url: '/api/auctions/auction/ChangeAuctionItemState?id=' + auctionId + '&itemId=' + auctionItemId + '&auctionItemState=' + auctionItemState,
        type: 'POST',
        contentType: 'application/json',
        success: function(data){
            callback(null, data);
        },
        error: function(request, status, error){
            console.log(err);
            callback(error, null);
        }
    });
};