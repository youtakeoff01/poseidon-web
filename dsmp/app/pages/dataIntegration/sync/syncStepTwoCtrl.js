'use strict';
/*
 * auth 杨丽娟
 * date 2017-08-10
 * description 数据源配置
 */
App.controller('syncStepTwoCtrl', function ($rootScope, $scope, NgTableParams, ngDialog, ngResource, toastr, $state, WizardHandler) {
    $scope.dataTableData = [];
    
    $scope.changeType = function (type) {
        $scope.syncInfoData.dataSource = '';
        $scope.syncInfoData.dataTable = '';
        $rootScope.dataType = type.name;  //数据源类型
        $scope.searchSource(type.name);
    }
    
        // 数据源类型
    $scope.dataSourceType = [{
        id: '1',
        name: 'MySQL'
    }, {
        id: '2',
        name: 'Oracle'
    },{
        id: '3',
        name: 'SQLServer'
    },{
        id: '4',
        name: 'PostgreSQL'
    },{
        id: '5',
		name: 'DB2'
    },{
        id: '6',
        name: 'Hive'
    }];

    // 根据数据源类型获取数据源
    $scope.searchSource = function(type){
        var dsParam = {
            dbType: type,
        };  
        ngResource.Query('psdon-web/dbSrcController/listAllDBSrcs', dsParam).then(function (data) {
            if (data.returnCode == '1') {
                $scope.dataBaseData = data.returnObject.dbsrcvos;
            } else if (data.returnCode == overTimeCode) {
                $state.go('login');
            }
        }); 
    }

    // 根据选择数据源查询数据表
    $scope.changeDataTable = function (index) {
        $scope.syncInfoData.dataTable = '';
        var params = {
            'id': index.id,
            'srcName': index.srcName
        };
        // // 用于第三部
        // ngResource.Query('psdon-web/dataSourceController/getDbSrcType', params).then(function (data) {
            
        //     if (data.returnCode == '1') {
        //         $rootScope.dbTypeData = data.returnObject;

        //     } else if (data.returnCode == overTimeCode) {
        //         $state.go('login');
        //     }
        // });
        // 用于获取数据表
        ngResource.Query('psdon-web/dataSourceController/getTablesName', params).then(function (data) {
            $scope.dataTableData = [];
            if (data.returnCode == '1') {
                var dataArr = data.returnObject;
                for (var i = 0; i < dataArr.length; i++) {
                    var temp = dataArr[i];
                    var user = new Object({});
                    user.tableName = dataArr[i];
                    $scope.dataTableData.push(user);
                }
                
            } else if (data.returnCode == overTimeCode) {
                $state.go('login');
            }
        });
    }
    
    //根据选择数据表获取字段
    $scope.getTablesDescript = function () {
        var params = {
            'id': $scope.syncInfoData.dataSource.id,
            'tableName': $scope.syncInfoData.dataTable.tableName
        };
        ngResource.Query('psdon-web/dataSourceController/getTablesDescript', params).then(function (data) {
            if (data.returnCode == '1') {
                $rootScope.temp = data.returnObject;
            } else if (data.returnCode == overTimeCode) {
                $state.go('login');
            }
        });
    }

    //下一步进行字段映射
    $scope.getNextData = function () {
        //数据源
        $rootScope.sendFile = [];
        for (var i in $rootScope.temp) {
            var obj = new Object({});
            obj.id = i;
            obj.name = $rootScope.temp[i];
            $rootScope.sendFile.push(obj);
        }
        if ( !$rootScope.dataType || !$scope.syncInfoData.dataSource.id || !$scope.syncInfoData.dataTable.tableName || !$scope.syncInfoData.coustom ) {
            toastr.error("请填写必填字段");
        } else {
            WizardHandler.wizard().next();
        }
    };
});