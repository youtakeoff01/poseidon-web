/**
 * 
 * auth yx
 * date 2018-04-18
 * description 平台管理-流程管理-我的申请
 * 
 */
'use strict';
App.controller('approvalCtrl', ['$scope','$rootScope','NgTableParams','ngResource', 'ngDialog',function($scope,$rootScope, NgTableParams, ngResource, ngDialog){
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
    $scope.studentAD = undefined;
    $scope.applyName = undefined;
    $scope.applyselect = $scope.applyState[0];
    var actionType;
    /*
  * 获取列表
  * @param {startPage} 页码
  * @param {count}   一页总数
  * @param {students} 学生AD
  * @param {approvals} 申请状态
  * @param {apperyer} 申请人
  * */
    $rootScope.approvalCtrlTableParams = new NgTableParams({
        page: 1,
        count: 10,
        sorting: {}
    }, {
        counts: [],
        getData: function($defer, params) {
            var param = {
              "startPage": params.page(),
              "count": params.count(),
              "students": [{
                "adNumber": $scope.studentAD
              }],
              "approvals": [{
                "approvalStatus": $scope.applyselect.id
              }],
              "apperyer": {
                "userName": $scope.applyName
              }
            };
            ngResource.Query('psdon-web/approvalController/listApplyMsg', param).then(function(data) {
                if(data.returnCode == '1') {
                  $scope.queryData = data.returnObject.listApply;
                  params.total(data.returnObject.countAll);
                  $defer.resolve($scope.queryData);
                }
            });
        }
    });

    // 列表搜索
    $scope.dataSearch = function(applyselect){
        $scope.applyselect = applyselect;
        $rootScope.approvalCtrlTableParams.page(1);
        $rootScope.approvalCtrlTableParams .reload();
    }

    //学生AD查询
    $scope.stuSearch = function(stuAD){
        $scope.applyselect = stuAD;
        $rootScope.approvalCtrlTableParams.page(1);
        $rootScope.approvalCtrlTableParams.reload();
    }

    //申请人查询
    $scope.applySearch = function(applyName){
        $scope.applyName = applyName;
        $rootScope.approvalCtrlTableParams.page(1);
        $rootScope.approvalCtrlTableParams.reload();
    }

    /*
     * 审批或者拒绝接口
     * */
      var refuseAndAgree = function (params) {
        ngResource.Query('psdon-web/approvalController/updateApprovalStatus',params).then(function(data) {
          //垃圾回收
          $scope.agreeItem = undefined;
          $scope.refuseItem = undefined;
          ngDialog.closeAll();
          $rootScope.approvalCtrlTableParams.reload();
          if($rootScope.applyTableParams){
            $rootScope.applyTableParams.reload();
          }
        });
      }

    $scope.ok = function () {
        if(actionType === 'agree'){
          var paramsAgree = $scope.agreeItem;
          paramsAgree.approvals[0].approvalStatus = 2;
          refuseAndAgree(paramsAgree)
        }else if(actionType === 'refuse'){
          var paramsRefuse = $scope.refuseItem;
          paramsRefuse.approvals[0].approvalStatus = 3;
          refuseAndAgree(paramsRefuse)
        }
    }


    // 通过提示
    $scope.agreed = function(item){
        $scope.dialogTitle = "提示";
        actionType = 'agree';
        $scope.agreeItem = item;
        $scope.dialogMessage = "确定通过该申请？";
        ngDialog.open({
            scope: $scope,
            width: 400,
            template: 'app/pages/common/warning.html'
        });
    }
    //拒绝审批
    $scope.refuse = function(item){
        actionType = 'refuse';
        $scope.refuseItem = item;
        $scope.dialogTitle = "提示";
        $scope.dialogMessage = "确定拒绝该申请？";
        ngDialog.open({
            scope: $scope,
            width: 400,
            template: 'app/pages/common/warning.html'
        });
    }
}])