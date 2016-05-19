angular.module('myFitMate')
.factory('MainHomeModel', [

function(){

    return {

        currentLocation: {korean: "우리나라"},
        cardSearch: {
            cardTypes: [
                {id:0, name:'ALL', korean:'전체'},
                {id:1, name:'CREDIT', korean:'신용카드'},
                {id:2, name:'CHECK',  korean:'체크카드'},
                {id:3, name:'MEMBER', korean:'멤버카드'},
            ],
            categoryTypes: [
                {id: 0, name: 'ALL', korean: '전체'},
                {id: 1, name: 'DINER/CAFE', korean: '외식/카페'},
                {id: 2, name: 'MART', korean: '쇼핑/마트'},
                {id: 3, name: 'LEISURE', korean: '문화/레져'},
                {id: 4, name: 'AUTOMOBILE', korean: '자동차/기타'},
            ],
            productTypes: [
                {id: 0, name: 'ALL', korean: '전체'},
                {id: 1, name: 'COFFEE', korean: '커피'},
                {id: 2, name: 'MOVIES', korean: '영화'},
                {id: 3, name: 'FOOD', korean: '음식'},
                {id: 4, name: 'PETROL', korean: '주유소'},
                {id: 5, name: 'TOYS', korean: '장난감'},
            ]
        },

//==========================================================================
//              To Server
//==========================================================================
        userSelectedCardType: {},
        userSelectedProductType: {},
        userSelectedCategoryType: {},
        userSelectedLocation:{},

//==========================================================================
//              From Server
//==========================================================================
        // 
        cards: []
    };
}])