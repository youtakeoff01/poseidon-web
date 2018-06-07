'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-19
 * description 平台用户-用户组管理
 */

App.controller('addGroupUserCtrl', function ($state, $scope, NgTableParams, ngDialog, ngResource, toastr, $rootScope) {
     var returnCode = "";
    $scope.addUserGroupData = [];

    $scope.seachTableName = function () {
        if ($scope.addUserGroupData.groupName != "") {
            var tableNameData = {
                'groupName': $scope.addUserGroupData.groupName
            };
            ngResource.Query('psdon-web/userGroupController/checkUsergroup', tableNameData).then(function (data) {
                 returnCode = data.returnCode;
                if (data.returnCode == '0') {

                } else if (data.returnCode == '1') {
                    //用户修改
                    // $scope.updateID = data.returnObject.id;
                     toastr.error(data.returnMessage);
                } else if (data.returnCode == overTimeCode) {
                    ngDialog.closeAll();
                    $state.go('login');
                }
            });
        }
    }

    //点击确定
    $scope.ok = function () {
         if (returnCode == '0') {
            if ($scope.addUserGroupData.groupName=="" || $scope.addUserGroupData.groupName == undefined || $scope.addUserGroupData.groupDesc == undefined) {
                toastr.error('请填写必填项');
            } else {

                var postBody = {
                    "groupName": $scope.addUserGroupData.groupName,
                    "groupDesc": $scope.addUserGroupData.groupDesc
                }

                ngResource.Add('psdon-web/userGroupController/createUsergroup', {}, postBody).then(function (data) {
                    if (data.returnCode == '1') {
                        $scope.tableParams.reload();
                        toastr.success('新增成功');
                        $scope.selected=[];
                    } else if (data.returnCode == overTimeCode) {
                        ngDialog.closeAll();
                        $state.go('login');
                    } else {
                        $scope.tableParams.reload();
                        toastr.error(data.returnMessage);
                    }
                    ngDialog.closeAll();
                });
            }
         }else if(returnCode == '1'){
             toastr.error("用户组已存在");
         }
       
    }


});