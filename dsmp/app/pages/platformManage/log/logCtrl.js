'use strict';
/*
 * auth zhangtingting_
 * date 2017年5月4日 14:51:26
 * description 平台管理-系统日志
 */
App.controller('logCtrl', function ($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {


    $scope.queryData = [{}];
    var tableData = [];

    //添加筛选条件
    $scope.dataSearch = function() {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    }

    $scope.tableParams = new NgTableParams(
        {page: 1, count: 10, sorting: {}},
        {
            counts: [], total: tableData.length, getData: function ($defer, params) {
            var param = {
                'startPage': params.page(),
                'count': params.count(),
                'logType':$scope.searchKey
            };
            ngResource.Query('psdon-web/logController/logSelect', param).then(function (data) {
                if (data.returnCode == '1') {
                    $scope.queryData = data.returnObject.lists;
                    params.total(data.returnObject.countAll);
                    $defer.resolve($scope.queryData);
                } else if (data.returnCode == overTimeCode) {
                    $state.go('login');
                }
            });
        }
        }
    );
    /*删除数据*/
    $scope.deleteTable = function (id) {
        $scope.dialogTitle = "提示";
        $scope.dialogMessage = "确定删除该日志?";
        ngDialog.open({
            scope: $scope,
            width: 400,
            template: 'app/pages/common/warning.html'
        });
    };
    /*编辑数据*/
    $scope.editLog = function () {
        $scope.dialogTitle = "编辑";
        ngDialog.open({
            scope: $scope,
            width: 600,
            template: 'app/pages/platformManage/log/editLog.html'
        });
    };
});