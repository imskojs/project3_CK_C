angular.module('myFitMate')
.controller('LoginController', [
'$ionicModal', '$scope', '$http', '$timeout',
function ($ionicModal, $scope, $http, $timeout){
    var Login = this;
    Login.viewPasswordMessage = false;

    function createModal(){
        $ionicModal.fromTemplateUrl('states/template/login/login-password-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal){
            Login.passwordModal = modal;
        });

        $ionicModal.fromTemplateUrl('states/template/login/login-membership-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal){
            Login.membershipModal = modal;
        });
    }

    Login.resetModal = function (){
        Login.passwordModal.remove();
        Login.membershipModal.remove();
        createModal();
    }

//==========================================================================
//              ON EVERY VISIT
//==========================================================================
    $scope.$on('$ionicView.enter', function (){
        createModal();
    })

//==========================================================================
//              Request server
//==========================================================================
    Login.requestTempPassword = function (){

        // Success function
        function success(){
            // show view
            Login.viewPasswordMessage = true;
            // hide automatically
            $timeout(function (){
                Login.passwordModal.hide();
                Login.viewPasswordMessage = false;
            }, 5000)
        }
    }

    Login.requestMembership = function (){
        function presend(){
            // checky
        }
        function success(){
            // popup 가입성공, 로그인하세요
            // resetModal
        }

        function err(){
            // popup 가입실패, 서버가 자나봐요!
        }
    }


}])