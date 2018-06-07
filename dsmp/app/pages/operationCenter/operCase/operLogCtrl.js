'use strict';
/*
 * auth 杨丽娟
 * date 2017-08-28
 * description 任务日志
 */
App.controller('operLogCtrl', function ($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {

    function searchlogData() {
        var param={
            'execJobName':$scope.datetoBehind.execJobName,
            'execId':$scope.datetoBehind.execId
        }
        ngResource.Query('psdon-web/dataTaskHistory/logDetail', param).then(function (data) {
            if (data.returnCode == '1') {
                $scope.logData=data.returnObject;
            } else if (data.returnCode == overTimeCode) {
                setTimeout(function(){
                    ngDialog.closeAll();
                },500)
                setTimeout(function(){
                    $state.go('login');
                },1000)
            }
        });

    }

    $scope.refresh=function () {
        searchlogData();
    }
    $scope.ok=function () {
        ngDialog.closeAll();
    }
    searchlogData();

});
