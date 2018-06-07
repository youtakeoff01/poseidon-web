'use strict';
/* 规则管理编辑 */
App.controller('editRuleManaCtrl', function($filter,$state, $scope, NgTableParams, ngDialog, ngResource, toastr, $rootScope) {
    $scope.ruleStates = ['上线','下线','禁用'];
    console.log($scope.RuleData);
    // 默认初值
    $scope.editRuleData = {}
    $scope.editRuleData.ruleName = $scope.RuleData.scriptTitle;
    $scope.editRuleData.ruleDes = $scope.RuleData.scriptDesc;
    for(var i in $scope.ruleStates){
        if($scope.ruleStates[i] == $scope.RuleData.scriptState){
            $scope.editRuleData.ruleState = $scope.ruleStates[i];
            break;
        }
    }
    // $scope.editRuleData.ruleEvent = $scope.RuleData   // 触发事件
    $scope.editRuleData.ruleContent = $scope.RuleData.scriptContent;
    // 提交
    $scope.ok = function(){
        if($scope.editRuleData.ruleName && $scope.editRuleData.ruleDes && $scope.editRuleData.ruleContent){
            submitEditRule();
        }else{
            toastr.error('请填写必填项');
        }
    }
    
    // 修改函数
    function submitEditRule(){
        var postBody = {
            id: $scope.RuleData.id,
            scriptTitle: $scope.editRuleData.ruleName,
            scriptDesc: $scope.editRuleData.ruleDes,
            scriptState: $scope.editRuleData.ruleState,
            triggerEvent: $scope.editRuleData.ruleEvent,
            scriptContent: $scope.editRuleData.ruleContent
        }
        ngResource.Update('psdon-web/paramSubmitController/updateScriptInfo', {}, postBody).then(function(data) {
            if(data.returnCode == '1') {
                toastr.success('修改成功');
            } else {
                toastr.error(data.returnMessage);
            }
            $scope.tableParams.reload();
            ngDialog.closeAll();
        });
    }
});