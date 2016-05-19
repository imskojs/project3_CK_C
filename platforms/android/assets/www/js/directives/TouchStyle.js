angular.module('myFitMate')
//==========================================================================
//              Style for user selection.
//==========================================================================
.directive('touch', function (){
	return {
		restrict: 'A',
		link: function (scope, element, attr){
			element.on('touchstart', function (e) {
				element.css({
					opacity: 0.5,
				})
                .addClass('touchBackground');

			})
			element.on('touchend dragstart', function (e) {
				element.css({
					opacity: 1
				})
                .removeClass('touchBackground');
			})
		}
	}
})
.directive('choose', function (){
	return {
		restrict: 'AC',
		link: function (scope, element, attr) {
            scope.$on('unselect', function (){
                element.removeClass('selected')
            })
			element.on('touchend', function (){
                if(element.hasClass('selected') && attr.toggle){
                    element.parent().children().removeClass('selected')
                } else {
                    element.parent().children().removeClass('selected')
                    element.addClass('selected');
                }
			})
		}
	}
})
.directive('toggleOnEmit', function (){
    return {
        restrict: 'AC',
        link: function (scope, element, attr){
            if(attr.toggleOnEmit){
                scope.$on(attr.toggleOnEmit, function (){
                    if(element.hasClass('selected')){
                        element.removeClass('selected')
                    } else {
                        element.addClass('selected')
                    }
                });
            }
        }
    }
})
.directive('default', function (){
    return {
        restrict: 'AC',
        link: function (scope, element, attr) {
            if(attr.default === ''){
                scope.$on('default', function (){
                    element.parent().children().removeClass('selected');
                    element.addClass('selected');
                })
            }
        }
    }
})
.directive('slider', function () {
    return {
        restrict:'A',
        compile: function (element, attr) {
            // wrap tag
            var contents = element.html();
            element.html('<div style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

            return function postLink (scope, element, attrs) {
                var content = element.children()[0],
                    target = element[0];

                // default properties
                attrs.duration = (!attrs.duration) ? '0.25s' : attrs.duration;
                attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                element.css({
                    'overflow': 'hidden',
                    'height': '0px',
                    'transitionProperty': 'height',
                    'transitionDuration': attrs.duration,
                    'transitionTimingFunction': attrs.easing
                });

                attrs.expanded = false;
                scope.$on('toggle-slider', function () {
                    if(!attrs.expanded) {
                        content.style.border = '1px solid rgba(0,0,0,0)';
                        var y = content.clientHeight;
                        content.style.border = 0;
                        target.style.height = y + 'px';
                    } else {
                        target.style.height = '0px';
                    }
                    attrs.expanded = !attrs.expanded;
                });
            };
        }
    };
})

.directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
});


//// FAILED MATERIAL DESIGN ATTEMPTED.
// .directive('touched', function () {
// 	return {
// 		restrict: 'A',
// 		link: function(scope, element, attr) {

// 			var parent, ink, d, x, y;

// 			element.on('touchstart', function (event){
// 				element.css({
// 					overflow: 'hidden',
// 					opacity:'0.5',
// 				})
// 				.addClass('relative');

// 			    if(element.find('ink').length === 0){
// 			        element.prepend('<ink></ink>');
// 			    }
// 			    var ink = element.find('ink');
// 			    ink.removeClass('animate');
// 			    if(!ink.prop('offsetHeight') && !ink.prop('offsetWidth')){
// 			        d =Math.max(element.prop('offsetWidth'), 
// 			        	element.prop('offsetHeight')
// 			        );
// 			        ink.css({height: d + "px", width: d + "px"});
// 			    }
// 			    x = event.layerX - ink.prop('offsetWidth')/2;
// 			    y = event.layerY - ink.prop('offsetHeight')/2;
// 			    ink.css({top: y + 'px', left: x + 'px'}).addClass('animate');
// 			});

// 			element.on('touchend', function (event){
// 				element.css({
// 					opacity: 1
// 				})
// 			})
// 		}
// 	};
// })
