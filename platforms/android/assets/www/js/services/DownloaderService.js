// Requires file-transfer phongap plugin
angular.module('myFitMate')
.factory('DownloaderService', [function (){

download = function (getFrom, saveTo, checkStorageKey, reset){

    if(!window.cordova){
        return;
    }
    if(reset){
        localStorage.setItem(checkStorageKey, "");
    }

    var bool = localStorage.getItem(checkStorageKey)
    console.log(bool);

    if(localStorage.getItem(checkStorageKey)== ""){
        console.log('First timer');

        localStorage.setItem(checkStorageKey, "1");
        console.log(localStorage.getItem(checkStorageKey))

        var fileTransfer = new FileTransfer();

        if(!Array.isArray(getFrom)){
            getFrom = [getFrom];
            saveTo = [saveTo];
        }

        getFrom.forEach(function (v, i, self){
            fileTransfer.download(v, saveTo[i], function success(entry){
                console.log(entry);
            }, function err(err){
                console.log(err);
            });
        })

    } else {
        console.log('Not your first time');
        
    }
};

return {
    download: download
};
//END
}]);


// EXAMPLE)
    // VideoService.videoDownloader(
    //     ['http://techslides.com/demos/sample-videos/small.mp4'],
    //     ["/sdcard/small2.mp4"],
    //     'KYOCHON_FIRST_TIME', 
    //     true
    // )
