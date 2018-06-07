'user strict';
/*
 * auth 
 * date 2018-01-5
 * description 任务管理-分区时间配置
 */
App.controller('parTimerCtrl',function($state, $scope, NgTableParams, ngDialog, ngResource, toastr){
    // 获取默认名称
    $scope.partition = {
        'taskand': '',
    };
    $scope.partition.name = $scope.parData.taskName;
    $scope.partition.field = $scope.parData.partition;
    if($scope.parData.starttime){
        $scope.partition.startDat = $scope.parData.starttime;
    }else{
        $scope.partition.startDat = '';
    }
    if($scope.parData.endtime){
        $scope.partition.endDat = $scope.parData.endtime;
    }else{
        $scope.partition.endDat = '';
    }
    
    // 提交
    $scope.ok = function (){
        var startTime = angular.element('#dateOne')[0].value;
        var endTime = angular.element('#dateTwo')[0].value;
        if(!$scope.partition.taskand){
            toastr.error("请填写必填项或填写符合规范字段");
        }else {
            if(startTime > endTime){
                toastr.error("请开始时间在结束时间之后");
            } else {
                param = {
                    'id': $scope.parData.id,
                    'partition': $scope.parData.partition,
                    'starttime': startTime,
                    'endtime': endTime,
                    'num': parseInt($scope.partition.taskand)
                };
                ngResource.Query('psdon-web/TaskController/scheduleTask', param).then(function(data) {
                    if(data.returnCode == '1') {
                        toastr.success(data.returnMessage);
                    } else if(data.returnCode == '0') {
                        toastr.error(data.returnMessage);
                    } else if(data.returnCode == overTimeCode) {
                        ngDialog.closeAll();
                        $state.go('login');
                    }
                    ngDialog.closeAll();
                    $scope.tableParams.page(1);
                    $scope.tableParams.reload();
                }); 
            }
        }
    }

})