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
'PushService', 'DownloaderService', '$rootScope', '$stateParams'    

,function ($ionicPlatform, AuthService, Permission, GovernorService, 
    PushService, DownloaderService, $rootScope, $stateParams) {

    $ionicPlatform.ready(function () {
        // PushService.registerDevice();
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    Permission.defineRole('firstTimer', function (stateParams){
        var firstTimer = localStorage.getItem('KYOCHON_FIRST_TIMER');
        if(firstTimer === null) {
            return true;
        } else {
            return false;
        }
    })
    $rootScope.state = $stateParams;

}])

.config([

'$stateProvider', '$urlRouterProvider', '$httpProvider'

,function ($stateProvider, $urlRouterProvider, $httpProvider) {
    // $httpProvider.interceptors.push('AuthInterceptor');
    // $httpProvider.defaults.withCredentials = true;
    $stateProvider

    .state('walkthrough', {
        url: '/walkthrough',
        params: {current: 'walkthrough'},
        templateUrl: 'states/template/walkthrough/walkthrough.html',
        controller: 'WalkthroughController as Walkthrough',
        data: {
            permissions: {
                only: ['firstTimer']
            }
        }
    })

    .state('login', {
        url: '/login',
        params: {current: 'login'},
        templateUrl: 'states/template/login/login.html',
        controller: 'LoginController as Login'
    })

    .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'states/template/main/main.html',
        controller: 'MainController as Main'
    })

    .state('main.home', {
        url: '/home',
        params: {parent: 'main', current: 'home' },
        views: {
            'main': {
                templateUrl: 'states/template/main-home/main-home.html',
                controller: 'MainHomeController as MainHome'
            }
        }
    })

    .state('main.membership', {
        url: '/membership',
        params: {parent: 'main', current: 'membership'},
        views: {
            main: {
                templateUrl: 'states/template/main-membership/main-membership.html',
                controller: 'MainMembershipController as MainMembership'
            }
        }
    })

    .state('main.setting', {
        url: '/setting',
        params: {parent: 'main', current: 'setting'},
        views: {
            main: {
                templateUrl: 'states/template/main-setting/main-setting.html',
                controller: 'MainSettingController as MainSetting'
            }
        }
    })

    .state('announcementModalList', {
        url: '/announcementModalList',
        params: {current: 'announcementModalList'},
        views: {
            'announcement-modal': {
                templateUrl: 'states/template/main-setting/main-setting-announcement-modal/main-setting-announcement-modal-list.html'
            }
        }
    })

    .state('announcementModalDetail', {
        url: '/announcementModalDetail',
        params: {postId: null},
        views: {
            'announcement-modal': {
                templateUrl: 'states/template/main-setting/main-setting-announcement-modal/main-setting-announcement-modal-detail.html'
            }
        }
    })

    $urlRouterProvider.otherwise(function (injector) {
        var $state = injector.get('$state');
        $state.go('main.setting');
    });
}]);
