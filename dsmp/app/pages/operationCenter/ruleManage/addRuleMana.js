'use strict';
/* 规则管理新增 */
App.controller('addRuleManaCtrl', function($filter,$state, $scope, NgTableParams, ngDialog, ngResource, toastr, $rootScope) {
    $scope.addRuleData = {};  // 用于存放新增数据
    $scope.ruleStates = ['上线','下线','禁用'];
    $scope.addRuleData.ruleState = $scope.ruleStates[0];

    // 提交
    $scope.ok = function(){
        if($scope.addRuleData.ruleName && $scope.addRuleData.ruleDes && $scope.addRuleData.ruleState && $scope.addRuleData.ruleContent){
            submitAddRule();
        }else{
            toastr.error('请填写必填项');
        }
    }
    
    //  增加规则函数
    function submitAddRule(){
        var postBody = {
            scriptTitle: $scope.addRuleData.ruleName,
            scriptDesc: $scope.addRuleData.ruleDes,
            scriptState: $scope.addRuleData.ruleState,
            triggerEvent: $scope.addRuleData.ruleEvent,
            scriptContent: $scope.addRuleData.ruleContent
        }
        ngResource.Add('psdon-web/paramSubmitController/insertScript', {}, postBody).then(function(data) {
            if(data.returnCode == '1') {
                toastr.success('新增成功');
            } else {
                toastr.error(data.returnMessage);
            }
            $scope.tableParams.reload();
            ngDialog.closeAll();
        }); 
    }
});