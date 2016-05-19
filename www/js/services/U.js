angular.module('myFitMate')
.factory('U', [function (){
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

    var emptyExtend = function (dst, src){
        empty(dst);
        extend(dst, src);
    };
    
    return {
        empty: empty,
        extend: extend,
        emptyExtend: emptyExtend
    }
}])
