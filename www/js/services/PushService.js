angular.module('applicat.push.service', ['ngCordova'])
.service('PushService', [

'$http', '$log', '$q', '$cordovaPush', '$cordovaToast', 
'$cordovaDialogs', '$cordovaLocalNotification', '$rootScope',
'googlePushSenderID', 'GovernorService'

,function ($http, $log, $q, $cordovaPush,
$cordovaToast, $cordovaDialogs,
$cordovaLocalNotification, $rootScope,
googlePushSenderID, GovernorService) {

    // Type
    var TYPE_ANDROID = 'ANDROID';
    var TYPE_IOS = 'IOS';

    // Trade notification
    var clubNotification = null;
    var deviceId = null;

    this.getClubNotification = function () {
        return clubNotification;
    }

    function setClubNotification(value) {
        clubNotification = value;
    }

    this.getDeviceId = function () {
        return deviceId;
    }

    function setDeviceId(value) {
        deviceId = value;
    }

    // Check whether first time
    this.hasClubNotification = function () {
        return (getClubNotification() != null);
    }

    // Register notification for trade blog
    this.registerNotification = function (optionalType) {
        var deferred = $q.defer();

        $http({
            url: GovernorService.getServerUrl() + '/push/device',
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            params: {"deviceId": this.getDeviceId(), "optionalType": optionalType}
        })
            .success(function (data, status, headers, config) {
                $log.info("PushService - Success updating device push settings " + JSON.stringify(data));
                setClubNotification(data.device.optionalType);
                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
                deferred.reject(data);
                $log.info("PushService - Failed updating device push settings");
            });

        return deferred.promise;

    }

    // Register notification for android
    this.registerDevice = function () {

        $log.info("PushService - Register push notification");

        var config = null;

        if (ionic.Platform.isAndroid()) {
            $log.info("PushService - Android push");
            var config = {
                "senderID": googlePushSenderID
            };
        }
        else if (ionic.Platform.isIOS()) {
            $log.info("PushService - IOS push");
            var config = {
                "badge": "true",
                "sound": "true",
                "alert": "true"
            }
        }

        if (!config) {
            $log.info("PushService - Not a supported device");
        }

        $cordovaPush.register(config).then(function (result) {
            $log.info("PushService - Register success " + result);

            // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
            if (ionic.Platform.isIOS()) {

                // Needs to change to out server call
                //storeDeviceToken("ios", result);
            }

        }, function (err) {
            $log.info("PushService - Register error " + err)
        });

    }

    // Stores the device token app server
    function storeDeviceToken(registration) {

        $log.info("PushService - register to server: " + JSON.stringify(registration));

        // Get Interest
        var deferred = $q.defer();

        $http({
            url: GovernorService.getServerUrl() + '/push/device',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            data: registration
        })
            .success(function (data, status, headers, config) {
                $log.info("PushService - registered to server: " + JSON.stringify(data));

                // Set devicePushId in PushService
                setDeviceId(data.device.deviceId);

                // If push setting exist than set the PushService
                if (angular.isDefined(data.device.optionalType))
                    setClubNotification(data.device.optionalType);

            })
            .error(function (data, status, headers, config) {
                $log.info("PushService - error: " + JSON.stringify(data));
            });

    }

    // Android Notification Received Handler
    function handleAndroid(notification) {
        // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
        //             via the console fields as shown.
        $log.info("In foreground " + JSON.stringify(notification));

        switch (notification.event) {
            case 'registered':

                if (notification.regid.length > 0) {
                    var registration = {
                        deviceId: notification.regid,
                        deviceType: TYPE_ANDROID
                    }

                    storeDeviceToken(registration);
                }

                break;
            case 'message':
                $log.info(JSON.stringify(notification));

                window.plugin.notification.local.schedule({
                    title: notification.payload.title,
                    text: notification.payload.message,
                    icon: "res://icon.png",
                    smallIcon: "res://pushicon.png"

                    // parameter documentation:
                    // https://github.com/katzer/cordova-plugin-local-notifications#further-informations-1
                });

                break;
            case 'error':
                $log.info('error');
                $cordovaDialogs.alert(notification.msg, "Push notification error event");
                break;
            default:
                $log.info('default');
                $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
                break;
        }
    }

    // IOS Notification Received Handler
    function handleIOS(notification) {
        // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
        // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
        // the notification when this code runs (weird).
        if (notification.foreground == "1") {
           // Play custom audio if a sound specified.
           if (notification.sound) {
               var mediaSrc = $cordovaMedia.newMedia(notification.sound);
               mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
           }
        
           if (notification.body && notification.messageFrom) {
               $cordovaDialogs.alert(notification.body, notification.messageFrom);
           }
           else $cordovaDialogs.alert(notification.alert, "Push Notification Received");
        
           if (notification.badge) {
               $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
                   $log.info("Set badge success " + result)
               }, function (err) {
                   $log.info("Set badge error " + err)
               });
           }
        }
        // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
        // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
        // the data in this situation.
        else {
           if (notification.body && notification.messageFrom) {
               $cordovaDialogs.alert(notification.body, "(RECEIVED WHEN APP IN BACKGROUND) " + notification.messageFrom);
           }
           else $cordovaDialogs.alert(notification.alert, "(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received");
        }
    }

    $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
        if (ionic.Platform.isAndroid()) {
            handleAndroid(notification);
        }
        else if (ionic.Platform.isIOS()) {
            handleIOS(notification);
        }
    });
}])
;