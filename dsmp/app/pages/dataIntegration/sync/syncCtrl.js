'use strict';
/*
 * auth 杨丽娟
 * date 2017-5-17
 * description 数据源同步
 */
App.controller('syncCtrl', function ($rootScope, $scope, NgTableParams, ngDialog, ngResource, toastr, $state, WizardHandler) {
    $scope.resultData = [];
    //对象-数据源
    $scope.syncInfoData = {
        dataSource: [],
        dataTable: [],
        dsmpSource: [],
        partitionText: []
    };
    // 数据源配置  自定义条件默认
    $scope.syncInfoData.coustom = '1=1'
    //实时同步切换
    $scope.syncStep = "0";
    $scope.stepChange = function (index) {
        $scope.syncStep = index;
    }

    //保存数据
    $scope.syncSave = function () {
        var params = {};
        // 如果目标表类型为Oracle,则将目标表名转换为大写
        if($rootScope.tgTypeName == 'Oracle'){
            $scope.syncInfoData.targetTable = $scope.syncInfoData.targetTable.toUpperCase();
        };
        params = {
            "jobType": $scope.syncInfoData.operType,
            "jobName": $scope.syncInfoData.jobName,
            "dataType":$rootScope.dataType,  // 数据源类型
            "dataSourceId": $scope.syncInfoData.dataSource.id,  // 数据源的ID
            "dataTable": $scope.syncInfoData.dataTable.tableName, // 数据表
            "syncDB": $scope.syncInfoData.dsmpSource.srcName,  // 目标源名字
            "dataFilter": $rootScope.temp,       // map 
            "udc": $scope.syncInfoData.coustom,  // 自定义条件
            "syncSource": $scope.syncInfoData.targetTable,  // 目标表
            "num": parseInt($scope.syncInfoData.targetAndTable), // 任务并行度  
            "is_partition": $rootScope.partition,  // 是否分区 
            "syncType": $rootScope.syncType,       // 分区的全量 增量
            "partition": $scope.syncInfoData.partitionText.id,  // 分区字段
            "partitionType": $scope.syncInfoData.partitionText.name, // 分区字段类型
            "remark": $scope.syncInfoData.desc     // 备注
        }
        ngResource.Query('psdon-web/dataSourceController/insertData', params).then(function (data) {
            if (data.returnCode == '1') {
                toastr.success("新增数据成功！");
            }else if(data.returnCode == '0'){
                toastr.error("新增数据失败！");
                WizardHandler.wizard().reset();
            } else if (data.returnCode == overTimeCode) {
                ngDialog.closeAll();
                $state.go('login');
            }
        });
    }
    
    // 返回首页
    $scope.back = function(){
        WizardHandler.wizard().reset();
        $scope.syncInfoData.jobName = '';
        $scope.permis = ''; 
        $scope.syncInfoData.dataSource = '';
        $scope.syncInfoData.dataTable = '';
        $scope.syncInfoData.dsmpSource = '';
        $scope.syncInfoData.coustom = '1=1';
        $scope.syncInfoData.targetTable = '';
        $scope.syncInfoData.desc = '';
        $scope.syncInfoData.targetAndTable = '';
        $scope.syncInfoData.partitionText = '';
    }
});