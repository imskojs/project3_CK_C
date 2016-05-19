angular.module('myFitMate')
.directive('barcode', function (){
    return {
        scope: {
            number: '@'
        },
        link: function (scope, element, attrs){
            var barcodeContainer = element[0]
            JsBarcode(barcodeContainer, scope.number, {
                width: 1,
                height: 60,
                format: 'CODE128',
                displayValue: true
            })
        }
    }
})