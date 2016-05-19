// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('myFitMate', [
    'ionic', 'ngCordova',

    // Angular Modules
    "permission",

    // Applicat Services
    'applicat.auth.service',
    'applicat.governor.services',
    'applicat.localstorage.service',
    'applicat.push.service',

    // MyFitMate Modules
    "myfitmate.config"

])
.run([

'$ionicPlatform', 'AuthService', 'Permission', 'GovernorService', 
'PushService'    

,function ($ionicPlatform, AuthService, Permission, GovernorService, PushService) {

    // // initialisation before ionic platform loads
    // // load user from local storage if already loggedin
    // AuthService.init();

    // Permission

    //     // User requiring email confirmation
    //     .defineRole('user', function () {
    //         var user = AuthService.getUser();

    //         console.log("Checking user permission");
    //         console.log(user);

    //         if (user) {
    //             return true;
    //         }

    //         return false;
    //     });

    $ionicPlatform.ready(function () {
        // PushService.registerDevice();
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        var fileTransfer = new FileTransfer();
        // var uri = encodeUrI("http://techslides.com/demos/sample-videos/small.mp4")

        fileTransfer.download(
            'http://techslides.com/demos/sample-videos/small.mp4',
            "/sdcard/small.mp4",
            // fileSystem.root.toURL() + "small.mp4",  // for ios
            function (entry){
                alert(JSON.stringify(entry, null, 2));
            },
            function (err){
                alert(JSON.stringify(err, null, 2));
            }
        );
    });

}])

.config([

'$stateProvider', '$urlRouterProvider', '$httpProvider'

,function ($stateProvider, $urlRouterProvider, $httpProvider) {
    // $httpProvider.interceptors.push('AuthInterceptor');
    // $httpProvider.defaults.withCredentials = true;
    $stateProvider

    .state('main', {
        url: '/main',
        templateUrl: 'states/main.html',
        controller: 'MainController as Main'
    })

    .state('video', {
        url: '/video',
        templateUrl: 'states/video/video.html',
        controller: 'VideoController as Video'
    })


    $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get('$state');
        $state.go('video');
    });
}]);
