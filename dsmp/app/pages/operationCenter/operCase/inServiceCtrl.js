'use strict';
/*
 * auth 杨丽娟
 * date 2017-08-10
 * description 运行中
 */
App.controller('inServiceCtrl', function ($state, $scope,$rootScope, NgTableParams, ngDialog, ngResource, toastr) {
    var actionType = [];
    $scope.tabData = [{}];
    var tableData = [];
    var datetoBehind = [];
    $scope.tabInfo = {};

    //添加筛选条件
    var searchName = "";
    $scope.dataSearch = function () {
        searchName = $scope.searchKey;
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    }

    $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10,
        sorting: {}
    }, {
        counts: [],
        total: tableData.length,
        getData: function ($defer, params) {
            var param = {
                'startPage': params.page(),
                'count': params.count(),
                'jobName': $scope.searchKey,
                'jobState': 30
            };
            ngResource.Query('psdon-web/dataTaskHistory/selectList', param).then(function (data) {
                if (data.returnCode == '1') {

                    $scope.tabData = data.returnObject.list;
                    params.total(data.returnObject.total);
                    $defer.resolve($scope.tabData);

                } else if (data.returnCode == overTimeCode) {
                    $state.go('login');
                }
            });
        }
    });


    $scope.selected = [];
    $scope.selectAll = function (isSelectAll) {
        for (var i = 0; i < $scope.tabData.length; i++) {
            if (isSelectAll == true) //全选
            {
                $scope.selected[i] = true;

            } else {
                $scope.selected[i] = false;

            }

        }
    };
    $scope.selectIndex = function (index) {
        console.log($scope.selected[index]);

    }

    $scope.editTable = function (item) {
        $scope.dialogTitle = "任务日志";
        $scope.datetoBehind = item;

        ngDialog.open({
            scope: $scope,
            width: 600,
            template: 'app/pages/operationCenter/operCase/operLog.html',
            appendClassName: 'ngdialog_log',
            controller: 'operLogCtrl'
        });
    };


    var destroyData=$rootScope.$on('Service',function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
        console.log("运行中");//接收广播
    })
    $scope.$on('$destroy',function(){//controller回收资源时执行
        destroyData();//回收广播
    });

});