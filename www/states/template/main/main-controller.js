angular.module('myFitMate')
.controller('MainController', [
    
'$ionicSideMenuDelegate', 'MainModel', '$rootScope', '$state',

function($ionicSideMenuDelegate, MainModel, $rootScope, $state){

    var Main = this;
    Main.user = MainModel.user;

    Main.toggleSideMenu = function (){
        $ionicSideMenuDelegate.toggleLeft();
    }

// END
}]);