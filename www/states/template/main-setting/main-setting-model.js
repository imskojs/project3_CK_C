angular.module('myFitMate')
.factory('MainSettingModel', [

function (){
    var MainSettingModel = {

        globalSetting: {
            locationSetting: 'on',
            pushSetting: 'on'
        },

        announcements: [
            // TODO: delete MOCK
            {
                postId: 1,
                title: '이것이 얼마나 길게 써지고써지고 지워지고 지워지고하는지요?',
                category: 'ANNOUNCEMENT',
                content: '123123123123',
                createdAt: '2014.05.10'
            },
            {
                postId: 2,
                title: '꽤나 길게 길게 써지는구려구려 구려 조금 구려어어',
                category: 'ANNOUNCEMENT',
                content: '아야어여오요우유으이아리가또',
                createdAt: '2014.06.10'
            }
        ],

//==========================================================================
//              Server
//==========================================================================
        toggleLocalNotification: function (){
            // send // input 'on' or 'off'
            MainSettingModel.globalSetting.pushSetting
            console.log(MainSettingModel.globalSetting.pushSetting);

        },
        getAnnouncements: function (){

        },

        sendEmail: function(inputObj){
            inputObj.createdBy = 'TODO: User.username';
            //TODO: test
            console.log(inputObj)
        }
    };






    return MainSettingModel;
    
}]);