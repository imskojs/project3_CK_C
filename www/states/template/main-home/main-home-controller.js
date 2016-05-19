angular.module('myFitMate')
.controller('MainHomeController', [
'MainHomeModel', '$timeout', '$http',
function (MainHomeModel, $timeout, $http){

    var MainHome = this;

    MainHome.currentLocation = MainHomeModel.currentLocation;

    // For select option views. ng-options
    MainHome.cardTypes = MainHomeModel.cardSearch.cardTypes;
    MainHome.categoryTypes = MainHomeModel.cardSearch.categoryTypes;
    MainHome.productTypes = MainHomeModel.cardSearch.productTypes;

    // Default values.
    MainHomeModel.userSelectedCardType = 
        MainHome.userSelectedCardType = 
            MainHome.cardTypes[1];

    MainHomeModel.userSelectedCategoryType =
        MainHome.userSelectedCategoryType = 
            MainHome.categoryTypes[1];

    MainHomeModel.userSelectedProductType =
        MainHome.userSelectedProductType = 
            MainHome.productTypes[1];

    // Save to model for server processing
    MainHome.saveCardType = function (card){
        MainHomeModel.userSelectedCardType = card;
    }
    MainHome.saveCategoryType = function (category){
        MainHomeModel.userSelectedCategoryType = category;
    }
    MainHome.saveProductType = function (product){
        MainHomeModel.userSelectedProductType = product;
    }


//==========================================================================
//              REQUEST SERVER
//==========================================================================

    MainHome.reqMatchingCardData = function (){
        // post data;
        var criteria = {
            cardType: MainHomeModel.userSelectedCardType.name,
            categoryType: MainHomeModel.userSelectedCategoryType.name,
            productType: MainHomeModel.userSelectedProductType.name
        }

        //TODO: $http.post


        // On Success Function
        function success(){
            // WANT;
            // Order by closest locations;
            // On clicking on card open up Daum map
            //and search locations clicked card provide
            //discount on.
            // Show places title.
            // Also show current users location.

            // HOW;
            // Get current location
            // Get cards discount places
            //where places is '스타박스', '멕도날드', 'etc'
            // if category-product is specified search places in
            //category product;
            // else if category-category is spcified search places in
            //category category;

            // category if productType is ALL
            // productType if categoryType is ALL

            // 
        }
    }



}])