/**
 * 
 * auth yx
 * date 2018-04-18
 * description 平台管理-流程管理-我的申请-新增申请
 * 
 */
'use strict';
App.controller('addapplyCtrl', ['$scope','$rootScope','NgTableParams','ngResource','ngDialog','toastr', function($scope,$rootScope,NgTableParams, ngResource, ngDialog,toastr){
    $scope.studentAdNumber = undefined;
    $scope.studentAdNumberTest = 1;
    $scope.approverOne = [];
    $scope.approverTwo = [];
    $scope.showStudentList = false;
    $scope.studentList = [];
    $scope.selStudent = [];
    $scope.selected = [];
    $scope.apply = {
        'selStudent': $scope.selStudent,
        'applyFirst': '',
        'applySecond': '',
        'time':3,
        'reason': ''
    }
    var approverOneData =[],approverTwoData=[];

    $scope.changeStudent = function($event,item){
        var flag = false;
        // 删除不勾选人员
        if(!$event.target.checked){
          for(var i=0; i<$scope.selected.length; i++){
            if(angular.isUndefined($scope.selected[i].name)){
              $scope.selStudent = $scope.selStudent.filter(function(item) {
                return item.id != $scope.selected[i];
              })
            }
          }
        }else {
          // 增加勾选的人员
          for(var i=0; i<$scope.selStudent.length; i++){
            if($scope.selStudent[i].id == item.id){
              flag = true;
              break
            }
          }
          if(flag == false){
            $scope.selStudent.push(item)
          }
        }
    }


    $scope.delete = function(id){
        $scope.selStudent = $scope.selStudent.filter(function(item) {
            return item.id != id;
        })
        
        $scope.selected = $scope.selected.filter(function(item) {
            return item.id != id;
        })
    }

    $scope.selectOne = function(approvalInfo){
        $scope.apply.applyFirst = approvalInfo;
        $scope.approverTwo = approverTwoData;
        $scope.approverTwo = $scope.approverTwo.filter(function(item) {
            return item.id != approvalInfo.id;
        })
    }
    $scope.selectTwo = function(approvalInfo){
        $scope.apply.applySecond = approvalInfo;
        $scope.approverOne = approverOneData;
        $scope.approverOne = $scope.approverOne.filter(function(item) {
            return item.id != approvalInfo.id;
        })
    }
    /*
    * 获取学生列表
    * @param { adNumber } 学生的AD
    * */
    $scope.studentSearch = function (number) {
        if(!number){
            return ;
        }
        var params = {
          adNumber:number
        }
        ngResource.Add('psdon-web/applyController/getStuentsMsg',{},params).then(function(data) {
            if(data.returnCode == 1){
              $scope.studentList = data.returnObject;
              $scope.showStudentList = true;
            }
        });
    }

    /*
     * 获取审批人信息
     * */
    $scope.getApprovalerInfo =  function () {
      ngResource.Add('psdon-web/applyController/getApprovalersMsg',{},{}).then(function(data) {
        if(data.returnCode == 1){
          $scope.approvalerInfo = data.returnObject;
          $scope.approverOne = $scope.approvalerInfo;
          approverOneData = $scope.approvalerInfo;
          $scope.approverTwo = $scope.approvalerInfo;
          approverTwoData = $scope.approvalerInfo;
        }
      });
    }
    /*
    * 新增审批
    * @param {students} 学生列表
    * @param {approvals} 审批人
    * @param {vld} 有效期
    * @param {applyReason} 申请理由
    * */
    $scope.addApproval =  function () {
        ngDialog.open({
          scope: $scope,
          width: 200,
          template: 'app/pages/common/loading.html'
        });
        var params = {
          "students":$scope.apply.selStudent,
          "approvals": [{approvaler:$scope.apply.applyFirst},{approvaler:$scope.apply.applySecond}],
          "vld":$scope.apply.time,
          "applyReason":$scope.apply.reason
        }
        ngResource.Add('psdon-web/applyController/submitApply',{},params).then(function(data) {
            if(data.returnCode == 1){
              $rootScope.applyTableParams.reload();
              if($rootScope.approvalCtrlTableParams){
                $rootScope.approvalCtrlTableParams.reload();
              }
              toastr.success('添加成功！');
              ngDialog.closeAll();
            }else {
              toastr.success('添加失败！');
              ngDialog.closeAll();
            }
        });
    }

    //加载执行
    $scope.getApprovalerInfo();
    // 确定增加
    $scope.ok = function(){
      if($scope.apply.selStudent.length==0 || !$scope.apply.reason){
        toastr.error('请将信息填写完全！')
        return ;
      }
      $scope.dialogTitle = "协议";
      ngDialog.open({
        scope: $scope,
        width: 800,
        template: 'app/pages/platformManage/processManage/agreement.html',
        controller:function ($scope) {
          $scope.agreementFlag = false;
          $scope.makeSureAddApply = function ($event,agreementFlag) {
            if($event.target.checked){
              $scope.agreementFlag = true;
            }else {
              $scope.agreementFlag = false;
            }
          }
          $scope.ok = function () {
            if($scope.agreementFlag){
              $scope.addApproval();
            }else{
              toastr.error('您未同意协议不能新建申请！');
            }
          }
        }
      });

    }
}])