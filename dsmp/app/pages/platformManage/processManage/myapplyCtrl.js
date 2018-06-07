/**
 * 
 * auth yx
 * date 2018-04-18
 * description 平台管理-流程管理-我的申请
 * 
 */
'use strict';
App.controller('applyCtrl', ['$scope','NgTableParams','ngResource','ngDialog','$rootScope', function($scope, NgTableParams, ngResource, ngDialog,$rootScope){
    $scope.showMore = undefined;
  // 审核状态
    $scope.applyState = [
        {
          name:'全部',
          id:undefined
        },
        {
            name: '待审批',
            id: '0'
        },{
            name: '审批中',
            id: '1'
        },{
            name: '已审批',
            id: '2'
        },{
            name: '已拒绝',
            id: '3'
        },{
            name: '已失效',
            id: '4'
        },{
            name: '已过期',
            id: '5'
        }
    ]
    $scope.applyselect = $scope.applyState[0];
    // 获取列表
    $rootScope.applyTableParams = new NgTableParams({
        page: 1,
        count: 10,
        sorting: {}
      }, {
      counts: [],
      getData: function($defer, params) {
        var param = {
          'startPage': params.page(),
          'count': params.count(),
          'applyStatus': $scope.applyselect.id,
          'students':{
            adNumber:$scope.studentAD
          },
        };
        ngResource.Query('psdon-web/applyController/listApplyMsg', param).then(function(data) {
          if(data.returnCode == '1') {
            $scope.queryData = data.returnObject.listApply;
            params.total(data.returnObject.countAll);
            $defer.resolve($scope.queryData);
          }
        });
      }
    });
    
    // 弹框新增
    $scope.addApply = function(){
        $scope.dialogTitle = "新增";
        ngDialog.open({
          scope: $scope,
          width: 800,
          template: 'app/pages/platformManage/processManage/addApply.html',
          controller: 'addapplyCtrl'
        });
    }

    // 状态搜索
    $scope.dataSearch = function(applyselect){
        $scope.applyselect = applyselect;
        $rootScope.applyTableParams.page(1);
        $rootScope.applyTableParams.reload();
    }

    // 姓名搜索
    $scope.keySearch = function(adNumber){
        $scope.studentAD = adNumber;
        $rootScope.applyTableParams.page(1);
        $rootScope.applyTableParams.reload();
    }
}])