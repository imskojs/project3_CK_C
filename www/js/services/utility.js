angular.module('myFitMate')
.factory('Utility', [

'Data', '$http', '$ionicLoading', '$ionicScrollDelegate', '$q', 
'$state', '$stateParams', '$timeout', 'GovernorService', 'AuthService'

,function (Data, $http, $ionicLoading, $ionicScrollDelegate, $q, $state, $stateParams,
                              $timeout, GovernorService, AuthService) {


    //Sub header menu scroller
    var subHeaderMenuScroller = function (arrayData, handle, $index, $event, centerAtIndex) {
        var menuLength = arrayData.length;
        var menuPixelLength = angular.element('.category-ul').prop('offsetWidth');
        var pixelPerItem = menuPixelLength / menuLength;
        var currentTarget = angular.element($event.currentTarget);
        var currentId = currentTarget.attr('id');

        currentTarget.siblings().removeClass('active');
        currentTarget.addClass('active');

        var pixelLocation = pixelPerItem * ($index - centerAtIndex);
        $ionicScrollDelegate.$getByHandle(handle).scrollTo(pixelLocation, 0, true);
    };
///////////////////////////////////////////////////////////////////
//////////////////////////// General //////////////////////////////
///////////////////////////////////////////////////////////////////
    var goTo = function (state, paramsObj) {
        arguments.length === 1 ? $state.go(state) : $state.go(state, paramsObj);
    };

    var loadingOff = function () {
        $ionicLoading.hide();
    };

    var loadingOn = function () {
        $ionicLoading.show({
            templateUrl: 'states/misc/loading.html'
        });
    };

    var errorMessage = function (message) {
        $ionicLoading.show({
            template: '<h2 class="error-message" style="color:red;">' + message + '<h2>',
            duration: 1500
        });
    };

    var warningMessage = function (message) {
        $ionicLoading.show({
            template: '<h2 class="error-message" style="color:#f14182;">' + message + '<h2>',
            duration: 1500,
        });
    }

    var getStateParam = function (paramName) {
        return $stateParams[paramName]
    }

    var empty = function (obj) {
        if (Array.isArray(obj)) {
            var length = obj.length;
            obj.forEach(function (value, i, self) {
                obj.splice(length - 1 - i, 1);
            })
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    delete obj[key];
                }
            }
        }
    };
    var extend = function (dst, src) {
        var same = Array.isArray(dst) === Array.isArray(src)
        if (Array.isArray(dst) && same) {
            src.forEach(function (value, i, self) {
                dst[i] = value;
            })
        } else {
            angular.extend(dst, src);
        }
    };

//////////////////////////////////////////////////////////////////
//////////////////// Communication to server /////////////////////
//////////////////////////////////////////////////////////////////
// Pre
    var findOne = function ($requestUrl, queryObj) {
        // Chrome preserves order in object if non-numeric key
        //var queryString = queryStringify(queryObj);

        var deferred = $q.defer();
        $http({
            url: GovernorService.getServerUrl() + $requestUrl,
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            params: {postId: queryObj.id}
        })
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function (data) {
                deferred.reject(data);
            })
        return deferred.promise;
    };

    var find = function ($requestUrl, queryObj) {
        var deferred = $q.defer();
        $http({
            url: GovernorService.getServerUrl() + $requestUrl,
            method: 'GET',
            params: queryObj,
            headers: {'Content-Type': 'application/json'}
        })
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function (data) {
                deferred.reject(data);
            })
        return deferred.promise;
    }

    var create = function ($requestUrl, data) {
        var deferred = $q.defer();
        $http({
            url: GovernorService.getServerUrl() + $requestUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        })
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function (data) {
                deferred.reject(data);
            });
        return deferred.promise;
    }

    var update = function ($requestUrl, findObj, updateObj) {
        var queryString = queryStringify(findObj);

        var deferred = $q.defer();
        $http({
            url: GovernorService.getServerUrl() + $requestUrl + '/' + queryString,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            data: updateObj
        })
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function (data) {
                deferred.reject(data);
            });
        return deferred.promise;
    }

    var destroy = function ($requestUrl, findObj) {

        var deferred = $q.defer();
        $http({
            url: GovernorService.getServerUrl() + $requestUrl,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            params: {postId: findObj.id}
        })
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function (data) {
                deferred.reject(data);
            });
        return deferred.promise;
    }


///////////////////////   OBJECT   //////////////////////
    return {
        // General //
        goTo: goTo,
        loadingOff: loadingOff,
        loadingOn: loadingOn,
        errorMessage: errorMessage,
        warningMessage: warningMessage,
        getStateParam: getStateParam,
        searchHandler: searchHandler,
        empty: empty,
        extend: extend,


        // Sub header //
        subHeaderMenuScroller: subHeaderMenuScroller
    };

//////// Helper functions ////////
    function queryStringify(queryObj) {
        var paramsArray = [];
        for (var key in queryObj) {
            paramsArray.push(queryObj[key]);
        }
        var queryString = paramsArray.join('/');
        return queryString;
    }



// End of Utility Service
}]);


