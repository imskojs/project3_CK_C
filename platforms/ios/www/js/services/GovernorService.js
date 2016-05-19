angular.module('applicat.governor.services', ['ngCordova'])
.factory('GovernorResolver', [

'GovernorService'

,function (GovernorService) {

    return {
        request: function (config) {
            if (config.url.indexOf(GovernorService.getServerUrl()) > -1) {
                //console.log("GovernorResolver - resource called " + config.url);
                GovernorService.stats(config);
                GovernorService.resolveRoute();
            }
            return config;
        }
    }

}])
.service('GovernorService', [

'$log', '$cordovaDialogs', '$cordovaDevice', 'governorUrl', 'appId'

,function ($log, $cordovaDialogs, $cordovaDevice, governorUrl, appId) {

    //var serverUrl = null;
    //var serverUrl = "http://192.168.43.119:1337";
    //var serverUrl = "http://192.168.0.65:1337";
    //var serverUrl = "http://myfitmate.applicat.co.kr";
    var serverUrl = "http://192.168.0.65:1337";
    function setServerUrl(url) {
        serverUrl = url;
    }

    this.getServerUrl = function () {
        return serverUrl;
    }

    // Resolve serverurl
    this.stats = function (config) {

        var deviceId = null;

        try {
            deviceId = $cordovaDevice.getUUID();

            if (this.getServerUrl() !== null) {
                var resource = config.url.replace(this.getServerUrl(), '');
            }

            $.ajax(governorUrl + '/app/' + appId, {
                method: 'POST',
                async: true,
                data: {request: resource, params: config.params, body: config.data, deviceId: deviceId}
            });

        } catch (err) {
            console.log(err);
            return;
        }

    };

    // Resolve serverurl
    this.resolveRoute = function () {
        $.ajax(governorUrl + '/app/' + appId, {
            method: 'GET',
            async: true
        })
            .done(function (data, textStatus, jqXHR) {
                $log.info("GovernorService - resolved initial server route " + data.url);
                setServerUrl(data.url);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                $cordovaDialogs.alert(jqXHR.responseJSON.message, '서버 정보', '확인')
                    .then(function () {
                        navigator.app.exitApp();
                    });
            });

    };

    // Resolve serverurl
    this.resolveRouteSync = function (successCallback) {


        $.ajax(governorUrl + '/app/' + appId, {async: true})
            .done(function (data, textStatus, jqXHR) {
                $log.info("GovernorService - resolved initial route " + data.url);
                setServerUrl(data.url);
                successCallback();
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 503) {
                    $cordovaDialogs.alert(jqXHR.responseJSON.message, '서버 정보', '확인')
                        .then(function () {
                            navigator.app.exitApp();
                        });
                }
                else {
                    $cordovaDialogs.alert('서버 점검중입니다.', '서버 정보', '확인')
                        .then(function () {
                            navigator.app.exitApp();
                        });
                }
            });
    };


}]);