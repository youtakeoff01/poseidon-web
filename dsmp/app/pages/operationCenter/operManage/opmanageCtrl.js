'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-23
 * description 运维中心-任务管理
 */
App.controller('opmanageCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
    //添加广播进行监听
    $scope.textShow = 1;
    $scope.refresh = function (index) {
        if (index == 1) {
            $scope.$emit("Sync");
            $scope.textShow = 1;
        }else if(index==2){
            $scope.$emit("Script");
            $scope.textShow = 2;
        }else if(index==3){
            $scope.$emit("Machine");
            $scope.textShow = 3;
        }else if(index == 4){
             $scope.textShow = 4;
            $scope.$emit("TaskInfo");
        }
    };

});