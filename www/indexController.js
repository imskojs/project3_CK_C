/* global angular */
angular.module('myFitMate')
.controller('IndexController', [

'$rootScope', '$state', '$ionicSideMenuDelegate', '$timeout',

function ($rootScope, $state, $ionicSideMenuDelegate, $timeout) {

//==========================================================================
//              PORTABLE LAZY CODES 
//==========================================================================
    $rootScope.goTo = function (state, params){
        if(params === undefined){
            params = {}
        }
        // if side menu is open, close it before moving states.
        if($ionicSideMenuDelegate.isOpenLeft()){
            $ionicSideMenuDelegate.toggleLeft(false);
            $timeout(function (){
                $state.go(state, params);
            }, 100)
        } else if($ionicSideMenuDelegate.isOpenRight()) {
            $ionicSideMenuDelegate.toggleRight(false);
            $timeout(function (){
                $state.go(state, params);
            }, 100)
        } else {
            $state.go(state, params);
        }
    }
}])