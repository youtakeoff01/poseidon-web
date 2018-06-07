'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-23
 * description 运维中心-任务情况
 */
App.controller('opmaintCaseCtrl', function($state,$rootScope, $scope, NgTableParams, ngDialog, ngResource, toastr) {

    //添加广播进行监听
    $scope.refresh = function (index) {
        if (index == 1) {
            $rootScope.executionShow = 1;
            $scope.$emit("Service");
        }else if(index == 2){
            $rootScope.executionShow = 2;
            $scope.$emit("Completed");
        }
    };

});