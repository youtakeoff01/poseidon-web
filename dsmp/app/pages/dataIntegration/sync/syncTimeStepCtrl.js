/**
 * Created by hand on 2017/7/6.
 */

App.controller('syncTimeStepCtrl', function($scope, ngDialog, ngResource, toastr, $state) {

    function searchData() {
        //实时同步数据加工
        ngResource.Query('psdon-web/dataSourceController/getFlumeData', '').then(function(data) {
            if(data.returnCode == '1') {
               var dataStr= data.returnObject.content;

               var result="";
               if(dataStr.indexOf("\\n")>0){
                   result=dataStr.replace(/(\\n)/g,"$1\n");
                   result=result.replace(/(\\n)/g,"");
               }
                 $scope.dataBaseData= result;

            } else if(data.returnCode == overTimeCode) {
                $state.go('login');
            }
        });
    }
    $scope.executeSyncData=function () {
        ngResource.Query('psdon-web/dataSourceController/executeFlumeData', "").then(function(data) {
            if(data.returnCode == '1') {
                toastr.success('表示执行配置文件信息成功 ');
                // searchData();
            } else if(data.returnCode == overTimeCode) {
                $state.go('login');
            }
        });
    }
    $scope.submitSyncData=function () {
        var param = {
            'strJson': $scope.dataBaseData
        };
        ngResource.Query('psdon-web/dataSourceController/updateFlumeData', param).then(function(data) {
            if(data.returnCode == '1') {
                toastr.success('实时同步成功');
                searchData();
            } else if(data.returnCode == overTimeCode) {
                $state.go('login');
            }
        });
    }
    searchData();
});
