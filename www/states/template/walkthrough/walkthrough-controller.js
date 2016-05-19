angular.module('myFitMate')
.controller('WalkthroughController', [
'$state', '$scope', 'WalkthroughModel', '$ionicHistory',
function ($state, $scope, WalkthroughModel, $ionicHistory){

    var Walkthrough = this;

    Walkthrough.goTo = function (){
        $state.go(WalkthroughModel.nextState);
    }
//==========================================================================
//              On Every Visit
//==========================================================================
    $scope.$on('$ionicView.enter', function (){
        localStorage.setItem('KYOCHON_FIRST_TIMER', "no")
        $ionicHistory.nextViewOptions ({
            disableBack: true
        })
    })
// END
}])