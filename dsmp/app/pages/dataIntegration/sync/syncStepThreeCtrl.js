'use strict';
/*
 * auth 杨丽娟
 * date 2017-08-10
 * description 目标源配置
 */
App.controller('syncStepThreeCtrl', function ($rootScope,$scope, NgTableParams, ngDialog, ngResource, toastr, $state, WizardHandler) {
    $scope.dsmpData = [];

    //同步方式
    $scope.changesyncType = function (index) {
        $rootScope.syncType = index;
    }

    //是否分区
    $rootScope.partition = 1;
    $scope.changepart = function (index) {
        $rootScope.partition = index;
    }

    // 目标源数据(根据数据源不同选择而不同)
    // console.log($rootScope.dataType)
    $scope.foo = function(){
        return $rootScope.dataType; 
    }
    
    // 监听模型变化 
    $scope.partitionDisplay = true;
    $scope.$watch($scope.foo, function(newValue,oldValue, scope){
        if(newValue){
            // console.log('里面改变',newValue)
            if(newValue == 'Hive'){
                $scope.targetSourceType = [{
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
                }];
                // 隐藏是否分区
                $scope.partitionDisplay =  false;
            }else{
                $scope.targetSourceType = [{
                    id: '1',
                    name: 'Hive'
                }];
                $scope.partitionDisplay =  true;
            }
            $scope.targetType = $scope.targetSourceType[0];
            // 默认获取目标源类型  $scope.targetType 目标源类型
            $rootScope.tgTypeName = $scope.targetType.name;
            $scope.getTargetSource($rootScope.tgTypeName);
            $scope.syncInfoData.dsmpSource = '';
        }
    },true)

        // 目标源类型选择
    $scope.targetChangeType = function (type) {
        $scope.syncInfoData.dsmpSource = '';
        $rootScope.tgTypeName = type.name;  // 目标源类型
        $scope.getTargetSource(type.name);
    }

        // 根据目标源类型获取目标源
    $scope.getTargetSource = function(type){
        var dtParam = {
            dbType: type,
        }; 
        ngResource.Query('psdon-web/dbSrcController/listAllDBSrcs', dtParam).then(function (data) {
            if (data.returnCode == '1') {
                $scope.dsmpData = data.returnObject.dbsrcvos;
                //  var dataArr = data.returnObject.dbsrcvos;
                // for (var i = 0; i < dataArr.length; i++) {
                //     var temp = dataArr[i];
                //     var user = new Object({});
                //     user.dsmpName = dataArr[i];
                //     $scope.dsmpData.push(user);
                // } 
            } else if (data.returnCode == overTimeCode) {
                $state.go('login');
            }
        });
    }

    //目标表的校验
    var tableNameReat = false;
    $scope.checkTable = function (index) {
        var params = {
            'srcName': $scope.syncInfoData.dsmpSource.srcName,  // 目标源名字
            'tableName': index,    // 目标表名字
            'dbType': $rootScope.tgTypeName,  // 目标源类型
        };
        ngResource.Query('psdon-web/dataSourceController/checkTable', params).then(function (data) {
            if (data.returnCode == '1') {
                tableNameReat = true;
                toastr.error("该目标源下目标表已经存在");
            } else if (data.returnCode == overTimeCode) {
                $state.go('login');
            }else{
                tableNameReat = false;
            }
        });
    }

    // 下一步进行字段映射
    $scope.getNextData = function () {
        if(tableNameReat){
            toastr.error("该目标源下目标表已经存在"); // 表名重复
        }else if($scope.syncInfoData.dsmpSource.length<1 || !$scope.syncInfoData.targetTable || !$scope.syncInfoData.targetAndTable){
            toastr.error("请填写必填字段或填写符合规范字段");
        }else{
            var params = {
                'map': $rootScope.temp,
                'srcType': $rootScope.dataType,
                'tarType': $rootScope.tgTypeName
            };
            
            ngResource.Query('psdon-web/dataSourceController/nextAndCaseTableType', params).then(function (data) {
    
                if (data.returnCode == '1') {
                    //同步源
                    $rootScope.fileMapData = [];
                    var foo = data.returnObject;
                    var obj = {};
                    for(var key in foo) {
                        obj = {};
                        obj.id = key;
                        obj.name = foo[key];
                        $rootScope.fileMapData.push(obj);
                    }
                } else if (data.returnCode == overTimeCode) {
                    $state.go('login');
                }
            }); 
            WizardHandler.wizard().next();
        }
    };

});