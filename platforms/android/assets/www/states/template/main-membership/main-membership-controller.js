angular.module('myFitMate')
.controller('MainMembershipController', [
'MainMembershipModel', '$http', 'U', '$scope', '$ionicModal',
function (MainMembershipModel, $http, U, $scope, $ionicModal){

    var MainMembership = this;

    MainMembership.broadcast = function (message){
        $scope.$broadcast(message);
    }

    MainMembership.membershipCards = MainMembershipModel.membershipCards;

    // DELETE BUTTON
    MainMembership.canDelete = false;

    MainMembership.toggleDelete = function (event, element){
        MainMembership.canDelete = !MainMembership.canDelete;
    }
    MainMembership.unsetDelete = function (){
        MainMembership.canDelete = false;
    }


    // REMOVE CARD
    MainMembership.remove = function (index){
        MainMembershipModel.membershipCards.splice(index, 1)  // placeholder function
        localStorage.setItem('CARDKING_BARCODED_CARDS', angular.toJson(
            MainMembershipModel.membershipCards
        ))
    };

    // ADD BUTTON
    var createAddCardModal = function (){
        $ionicModal.fromTemplateUrl('states/partial/misc/main-membership-addCard-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal){
            MainMembership.addCardModal = modal;
        });
    }
    createAddCardModal();
        // Default barcode color
    var resetAddCard = function (){
        MainMembership.addCard = {};
        MainMembership.addCard.color = 'pinky';
        MainMembership.addCard.title = '';
        MainMembership.addCard.number = '';
        MainMembership.addCard.barcode = false;
        $scope.$broadcast('default');
        MainMembership.broadcast('addCardButtonStyleToggle')
    }
    MainMembership.resetAddCard = resetAddCard;

    // {
    //     color: 'pinky',
    //     korean: 'CJ One 멤버쉽 카드0',
    //     cardNumber: 0109450264113
    // },
    MainMembership.saveNewCard = function () {
        MainMembershipModel.membershipCards.push({
            color: MainMembership.addCard.color,
            korean: MainMembership.addCard.title,
            cardNumber: MainMembership.addCard.number
        });
        localStorage.setItem('CARDKING_BARCODED_CARDS', 
            angular.toJson(MainMembershipModel.membershipCards)
        );
        MainMembership.addCardModal.hide();
        resetAddCard();
    };

    $scope.$on('$ionicView.enter',function (){
        // Set defaults
        MainMembership.addCard = {};
        MainMembership.addCard.color = 'pinky';
        MainMembership.addCard.title = '';
        MainMembership.addCard.number = '';
        MainMembership.addCard.barcode = false;
        $scope.$broadcast('default');
        var savedCards = angular.fromJson(localStorage.getItem('CARDKING_BARCODED_CARDS'));
        if(savedCards !== null && savedCards.length !== 0){
            U.emptyExtend(MainMembershipModel.membershipCards, savedCards);
        }
    });

    $scope.$on('$ionicView.leave',function (){
        MainMembership.unsetDelete();
        $scope.$broadcast('unselect')
    })
    


}])