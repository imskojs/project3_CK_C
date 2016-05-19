angular.module('myFitMate')
.controller('MainController', [
'$ionicSideMenuDelegate', '$scope',
function($ionicSideMenuDelegate, $scope){

    var Main = this;

    Main.toggleSideMenu = function (){
        $ionicSideMenuDelegate.toggleLeft();
    }

    Main.test = function {
        console.log('test');
    };

    Main.toggleSlider = function () {
        $scope.$broadcast('toggle-slider');
    };
    
// END
}]);