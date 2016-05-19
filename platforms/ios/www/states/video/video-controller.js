angular.module('myFitMate')
.controller('VideoController', [

'VideoModel', '$window'

,function(VideoModel, $window){

    var Video = this;

    Video.currentVideo = VideoModel.currentVideo;
    Video.videoLists = VideoModel.videoLists;

    
// END
}]);