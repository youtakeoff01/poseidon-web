'use strict';
/*
 * auth 
 * date 2018-2-6
 * description 提交任务自定义参数配置
 */
App.controller('sqoopCustomCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
    $scope.testType = [];
    // 默认获取之前的值
    $scope.testType.userParam = $scope.setJarParam.userParam;

    $scope.ok = function(){
        var param = {
            'taskAttributeEntity': {
                'id': $scope.setJarParam.id,
                'userParam': $scope.testType.userParam
            },
            'latestTaskEntity': {
                'taskName': $scope.setJarParam.taskName,
                'taskType': $scope.setJarParam.taskType,
                'taskAttrId': $scope.setJarParam.taskAttrId
            }
        };
        ngResource.Query('psdon-web/tasksubmitcontroller/setParamsJarTask', param).then(function(data) {
            if(data.returnCode == '1') {
                toastr.success(data.returnObject.returnMessage);
                ngDialog.closeAll();
                $scope.tableParams.page(1);
                $scope.tableParams.reload();
            } else if(data.returnCode == '0') {
                toastr.error(data.returnMessage);
                ngDialog.closeAll();
            } else if(data.returnCode == overTimeCode) {
                ngDialog.closeAll();
                $state.go('login');
            }
        });
    }
})