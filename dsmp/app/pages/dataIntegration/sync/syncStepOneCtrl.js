'use strict';
/*
 * auth 杨丽娟
 * date 2017-08-10
 * description 新建任务
 */
App.controller('syncStepOneCtrl', function($scope, $rootScope, ngDialog, ngResource, toastr, $state, WizardHandler) {

	/* $scope.taskData = [{
		id: '1',
		name: "同步任务"
	}]; 
	$scope.syncInfoData.operType = $scope.taskData[0];*/
	// 默认为同步任务，且不能更改
	$scope.syncInfoData.operType = '同步任务';

	$scope.checkAzkabanJobName = function(index) {
		if(index) {
			var param = {
				'jobName': index
			};
			ngResource.Query('psdon-web/dataSourceController/checkAzkabanJobName', param).then(function(data) {
				$scope.returnCode = "";
				if(data.returnCode == '1') {
					$scope.returnCode = data.returnCode;
					toastr.error("该任务存在,不可以创建");
				} else if(data.returnCode == overTimeCode) {
					$state.go('login');
				}
			})
		} else {

		}
	}
	//权限功能单选
	$scope.changeRadio = function(index) {
		$scope.datePrem = index;
	}

	//下一步进行字段映射
	$scope.getNextData = function() {
		if(!$scope.syncInfoData.operType || !$scope.syncInfoData.jobName) {
			toastr.error("请填写必填字段或填写符合规范字段");
		} else if($scope.returnCode == '1') {

		} else {
			WizardHandler.wizard().next();
		}
	};

});