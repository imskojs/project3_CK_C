angular.module('myFitMate')
.controller('MainSettingController', [
'$scope', '$ionicModal', 'MainSettingModel', '$state', '$ionicHistory', 
'$stateParams',
function ($scope, $ionicModal, MainSettingModel, $state, $ionicHistory,
$stateParams
){
    var MainSetting = this;
    // Link Model
    MainSetting.globalSetting = MainSettingModel.globalSetting;
    MainSetting.announcements = MainSettingModel.announcements;
//==========================================================================
//              ANNOUNCEMENT SECTION 
//==========================================================================
    // Create Modals
    function createAnnouncementModal(){
        $ionicModal.fromTemplateUrl('states/template/main-setting/main-setting-announcement-modal/main-setting-announcement-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        })
        .then(function (modal){
            MainSetting.announcementModal = modal;
        })
    }
    createAnnouncementModal();
    // Announcement clicked
    MainSetting.announcementClickHandler = function (){
        MainSetting.announcementModal.show();
        $state.go('announcementModalList');
        MainSetting.announcementSection.getAnnouncements();
    }
    // Back from Announce Section
    MainSetting.announcementSection = {};
    MainSetting.announcementSection.backHandler = function (){
        if($state.current.name === 'announcementModalList'){
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            })
            $state.go('main.setting');
            MainSetting.announcementModal.hide();
        } else if($state.current.name === 'announcementModalDetail'){
            $state.go('announcementModalList');
        }
    }
    // Get detail of announcement
    MainSetting.announcementSection.goToDetail = function (announcement){
        $state.go('announcementModalDetail');
        MainSetting.announcementSection.currentAnnouncement = announcement;
    }
//==========================================================================
//              SEND EMAIL SECTION 
//==========================================================================
    // Create modal
    function createSendEmailModal(){
        $ionicModal.fromTemplateUrl('states/template/main-setting/main-setting-sendEmail-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        })
        .then(function (modal){
            MainSetting.sendEmailModal = modal;
        })
    }
    createSendEmailModal();
    // Go to write Email
    MainSetting.sendEmailClickHandler = function (){
        MainSetting.sendEmailModal.show();
    }
    // Back from sendEmail Section
    MainSetting.sendEmailSection = {};
    MainSetting.sendEmailSection.backHandler = function (){
        MainSetting.sendEmailModal.hide();
    }
    // Email content object
    MainSetting.sendEmailSection.email = {}
    // Send Email Handler
    MainSetting.sendEmailHandler = function (email){
        MainSetting.sendEmailSection.sendEmail(email);
        MainSetting.sendEmailSection.email.title = '';
        MainSetting.sendEmailSection.email.content = '';
    }
//==========================================================================
//              SERVER
//==========================================================================
    MainSetting.toggleLocalNotification = MainSettingModel.toggleLocalNotification;
    // get announcements from server.
    MainSetting.announcementSection.getAnnouncements = MainSettingModel.getAnnouncements;

    // Send email. inputObj = {title: '', content: '', createdBy: ''}
    MainSetting.sendEmailSection.sendEmail = MainSettingModel.sendEmail;

}])