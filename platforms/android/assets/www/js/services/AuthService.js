'user strict'

angular.module('applicat.auth.service', [])
.factory('AuthInterceptor', [

'$q', '$injector', '$location', 'LocalService', 'appName'

,function ($q, $injector, $location, LocalService, appName) {

    return {
        request: function (config) {

            var token = LocalService.get(appName + '_auth_token');

            if (token) {
                token = angular.fromJson(LocalService.get(appName + '_auth_token')).token;
            }

            if (token) {
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        },
        responseError: function (response) {
            if (response.status === 401 || response.status === 403 || response.status === 405 || response.status === 498) {

                if ($location.path() !== "/init/login") {

                    LocalService.unset(appName + '_auth_token');
                    $location.path("/login");

                    if (response.data == null || response.data == undefined) {
                        response.data = {message: "권한이 없는 페이지이거나 로그인하지 않았습니다. 로그인해주세요."};
                    }
                } else {
                    response.data.hideMessage = true;
                }
            } else if (response.status === 300) {

                var redirectPath = null;
                var message = '';
                switch (response.data.redirectCode) {
                    case 'ACTIVATE':
                        redirectPath = "/resend/false";
                        message: "이메일 인증을 하셔야 서비스 이용이 가능합니다.";
                        break;
                    case 'RESET':
                        redirectPath = "/passReset";
                        message: "비밀번호를 봐꿔주세요.";
                        break;
                }

                if ($location.path() !== redirectPath) {

                    $location.path(redirectPath);

                    if (response.data == null || response.data == undefined) {
                        response.data = {message: message};
                    }
                } else {
                    response.data.hideMessage = true;
                }
            }
            return $q.reject(response);
        }
    }
}])
.service("AuthService", [

'$http', '$q', '$location', '$state', '$cordovaOauth', 'kakaoKey', 
'facebookKey', 'GovernorService', 'LocalService', 'appName'    

,function ($http, $q, $location, $state, $cordovaOauth, kakaoKey, 
facebookKey, GovernorService, LocalService, appName) {

    var user = null;
    var selectedApp = {
        name: '어플리켓'
    };

    function setUser(userInfo) {
        user = userInfo;
    }

    this.getUser = function () {
        return user;
    }

    function setApp(app) {
        $rootScope.appName = app.name;
        selectedApp = app;
    }

    this.getApp = function () {
        return selectedApp;
    }

    this.getToken = function () {
        var token = LocalService.get(appName + '_auth_token');

        if (token) {
            token = angular.fromJson(LocalService.get(appName + '_auth_token')).token;
            return token;
        } else {
            $state.go('login');
        }
    }

    this.init = function () {
        var token = JSON.parse(LocalService.get(appName + '_auth_token'));
        if (token != null && token.user != null)
            setUser(token.user);
    }

    this.loginWIthKakao = function () {

        var deferred = $q.defer();

        $cordovaOauth.kakao(kakaoKey).then(function (result) {
            result.provider = 'kakao';

            $http({
                url: GovernorService.getServerUrl() + '/auth/kakao/register',
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: result
            })
                .success(function (data, status, headers, config) {

                    LocalService.set(appName + '_auth_token', JSON.stringify(data));
                    console.log(JSON.stringify(data, null, 2));
                    console.log(JSON.stringify(data.user, null, 2));
                    setUser(data.user);

                    deferred.resolve({message: 'done'});
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                });


        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    this.loginWIthFacebook = function () {

        var deferred = $q.defer();

        $cordovaOauth.facebook(facebookKey, ["email"]).then(function (result) {
            result.provider = 'facebook';

            $http({
                url: GovernorService.getServerUrl() + '/auth/facebook/register',
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: result
            })
                .success(function (data, status, headers, config) {

                    LocalService.set(appName + '_auth_token', JSON.stringify(data));
                    setUser(data.user);
                    console.log(JSON.stringify(data, null, 2));
                    console.log(JSON.stringify(data.user, null, 2));

                    deferred.resolve({message: 'done'});
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                });


        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    this.getUserDetail = function () {
        var deferred = $q.defer();

        $http({
            url: GovernorService.getServerUrl() + '/user/detail',
            method: 'get',
            headers: {'Content-Type': 'application/json'}
        })
            .success(function (data, status, headers, config) {
                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
                deferred.reject(data);
            });

        return deferred.promise;
    }

    this.register = function (user) {

        var deferred = $q.defer();

        $http({
            url: GovernorService.getServerUrl() + '/user/register',
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            params: user
        })
            .success(function (data, status, headers, config) {
                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
                deferred.reject(data);
            });
        return deferred.promise;
    }

    this.registerWithImage = function (user, file, success, fail) {

        var options = new FileUploadOptions();

        options.params = user;
        options.headers = {
            Connection: "close"
        }
        options.chunkedMode = false;

        var ft = new FileTransfer();

        ft.upload(file, encodeURI(GovernorService.getServerUrl() + '/user/registerWithImage'), success, fail, options, true);
    }

    this.login = function (email, password) {

        var deferred = $q.defer();

        $http({
            url: GovernorService.getServerUrl() + '/user/login',
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            data: {'email': email, 'password': password}
        })
            .success(function (data, status, headers, config) {

                LocalService.set(appName + '_auth_token', JSON.stringify(data));
                setUser(data.user);

                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
                deferred.reject(data);
            });

        return deferred.promise;

    }

    this.verifyResetCode = function (userId, code) {

        var deferred = $q.defer();


        $http({
            url: GovernorService.getServerUrl() + '/user/passwordresetcomplete',
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            data: {'user': userId, 'code': code}
        })
            .success(function (data, status, headers, config) {
                LocalService.set(appName + '_auth_token', JSON.stringify(data));
                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
                deferred.reject(data);
            });

        return deferred.promise;

    }

    this.logout = function () {
        LocalService.unset(appName + '_auth_token');
        setUser(null);
        $location.path("/init/login");
    }

    this.changePassword = function (oldPassword, newPassword) {

        var deferred = $q.defer();

        $http({
            url: GovernorService.getServerUrl() + '/user/changePassword',
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            data: {'oldPassword': oldPassword, 'newPassword': newPassword}
        })
            .success(function (data, status, headers, config) {
                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
                deferred.reject(data);
            });

        return deferred.promise;
    }

    this.passReset = function (userId, email) {

        var deferred = $q.defer();

        $http({
            url: GovernorService.getServerUrl() + '/user/resetStart',
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            data: {'userId': userId, 'email': email}
        })
            .success(function (data, status, headers, config) {
                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
                deferred.reject(data);
            });
        return deferred.promise;
    }

    this.passResetComplete = function (newPassword) {

        var deferred = $q.defer();

        $http({
            url: GovernorService.getServerUrl() + '/user/reset',
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            data: {'newPassword': newPassword}
        })
            .success(function (data, status, headers, config) {
                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
                deferred.reject(data);
            });
        return deferred.promise;
    }

    this.resend = function (username, email) {

        var deferred = $q.defer();

        $http({
            url: GovernorService.getServerUrl() + '/user/resend',
            method: 'post',
            headers: {'Content-Type': 'application/json'}
        })
            .success(function (data, status, headers, config) {
                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
                deferred.reject(data);
            });
        return deferred.promise;
    }

    this.checkUserId = function (userId) {

        var deferred = $q.defer();

        $http({
            url: GovernorService.getServerUrl() + '/user/checkId',
            method: 'get',
            headers: {'Content-Type': 'application/json'},
            params: {userId: userId}
        })
            .success(function (data, status, headers, config) {
                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
                deferred.reject(data);
            });
        return deferred.promise;
    }

    this.checkEmail = function (email) {

        var deferred = $q.defer();

        $http({
            url: GovernorService.getServerUrl() + '/user/checkEmail',
            method: 'get',
            headers: {'Content-Type': 'application/json'},
            params: {email: email}
        })
            .success(function (data, status, headers, config) {
                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
                deferred.reject(data);
            });
        return deferred.promise;
    }

    this.selectApplication = function (id) {

        var deferred = $q.defer();

        $http({
            url: GovernorService.getServerUrl() + '/application/' + id,
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
            .success(function (data, status, headers, config) {
                //
                //data.
                //
                //var selectedApp = {
                //  name: data.name,
                //
                //}
                //
                //setApp(selectedApp);
                deferred.resolve();
            })
            .error(function (data, status, headers, config) {

                deferred.reject(data);
            });

        return deferred.promise;
    }

}]);


