'use strict';
/*
 * auth 杨丽娟
 * date 2017-08-10
 * description 完成状态
 */
App.controller('completedStateCtrl', function ($state, $scope,$rootScope, NgTableParams, ngDialog, ngResource, toastr) {
    var actionType = [];
    $scope.tabData = [{}];
    var tableData = [];
    var datetoBehind = [];
    $scope.tabInfo = {};
    var param = {};
    /* 该页面从两个地方进，一是点击tab进， 二是从任务运维进 三是从控制台进*/

    // 从任务管理中传来的任务，并查询任务状态
    // 运行状态选择对象
	$scope.searchState;
	$scope.stateData = [{
        id:'1',
        name: '所有'
    },{
        id:'30',
        name: '运行中'
    },{
		id: '50',
		name: '运行成功'
	}, {
		id: '60',
		name: '未完成'
	}, {
		id: '70',
		name: '运行失败'
	}];
    
    // 任务状态筛选
	$scope.getSelectState = function(operStatu) {
        param.jobState = null;
        // 如果为‘所有’不传值，如果为其他传对应ID
        if(operStatu.id == 1){
            $scope.tableParams.reload();
        }else{
            param.jobState = operStatu.id;
            $scope.tableParams.page(1);
            $scope.tableParams.reload();
        }
    }

    // 从任务运维进  监听任务名变化再进行查询 
        // 监听对象
    $scope.foo = function(){
        return $rootScope.textName; 
    }
    $scope.$watch($scope.foo,function(newValue, oldValue, scope){
        if(newValue){
            $scope.searchKey = $rootScope.textName;
            param.jobName = $rootScope.textName;
            $scope.tableParams.reload();
        }
    })
    // 从控制台进入 监听任务状态变化再进行查询
    $scope.$watch(function(){
        return $rootScope.textStatus
    }, function(newValue, oldValue, scope){
        if(newValue){
            for(var i in $scope.stateData){
                if($scope.stateData[i].name == $rootScope.textStatus){
                    param.jobState = $scope.stateData[i].id;
                    $scope.searchState = $scope.stateData[i];
                    console.log($scope.searchState)
                    $scope.tableParams.reload();
                    return;
                }
            }
        }
    })
    // 任务名查询
    var searchName = "";
    $scope.dataSearch = function () {
        param.jobName = $scope.searchKey;
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    }

    // 从tab栏进
    $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10,
        sorting: {}
    }, {
        counts: [],
        total: tableData.length,
        getData: function ($defer, params) {
            param.startPage = params.page();
            param.count = params.count();
            ngResource.Query('psdon-web/dataTaskHistory/selectList', param).then(function (data) {
                if (data.returnCode == '1') {
                    $scope.tabData = data.returnObject.list;
                    params.total(data.returnObject.count);
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
                $scope.selected[$scope.tabData[i].id] = true;

            } else {
                $scope.selected[$scope.tabData[i].id] = false;

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

    var destroyData=$rootScope.$on('Completed',function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
        console.log("完成时");//接收广播
    })
    $scope.$on('$destroy',function(){//controller回收资源时执行
        destroyData();//回收广播
    });

});