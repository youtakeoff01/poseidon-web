'use strict';
/* auth 
 * date 2018-01-08
 * description jar任务配置的修改
 */
App.controller('editJarConfigCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
	/* $scope.typeData = [{
		id: '1',
		name: "STORM"
	}, {
		id: '2',
		name: "SPARK"
	}]; */
	$scope.editJrtsData = [];
	// 默认获取之前值
	$scope.editJrtsData.type = $scope.editJarTask.taskType;
	$scope.editJrtsData.name = $scope.editJarTask.taskName;
	$scope.editJrtsData.enclass = $scope.editJarTask.entryClass;
	$scope.editJrtsData.system = $scope.editJarTask.systemParam;
	$scope.editJrtsData.user = $scope.editJarTask.userParam;

	//名称的校验
	$scope.checkName = function() {
		var param = {
			'taskName': $scope.editJrtsData.name,
			'taskType': $scope.editJrtsData.type
		};
		ngResource.Query('psdon-web/tasksubmitcontroller/checkJarTaskName', param).then(function(data) {
			if(data.returnCode == '0') {
				toastr.error("该任务存在,不可以创建");
			} else if(data.returnCode == overTimeCode) {
				ngDialog.closeAll();
				$state.go('login');
			}
		});
	}

	$scope.ok = function() {
		if(angular.isUndefined($scope.editJrtsData.enclass) || angular.isUndefined($scope.editJrtsData.system) || angular.isUndefined($scope.editJrtsData.user) ){
			toastr.error('请填写必填项');
		}else{
			var param = {
				"taskAttributeEntity": {
					"id": $scope.editJarTask.id,
					"entryClass": $scope.editJrtsData.enclass,  // 入口类
					"systemParam": $scope.editJrtsData.system,  // 系统参数
					"userParam": $scope.editJrtsData.user   // 用户参数
				},
				"latestTaskEntity": {
					"taskName": $scope.editJrtsData.name,  // 配置时的任务名称
					"taskType": $scope.editJarTask.taskType , // 配置时的任务类型
					"taskAttrId": $scope.editJarTask.taskAttrId  
				},
				"jarInfoEntity":{
					"jarPath": $scope.editJarTask.jarPath  // jar路径
				}
			}
			ngResource.Query('psdon-web/tasksubmitcontroller/updateJarTask', param).then(function(data) {
				if(data.returnCode == '1') {
					toastr.success('任务配置成功');
					$scope.tableParams.page(1);
					$scope.tableParams.reload();
				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
					$state.go('login');
				} else if(data.returnCode == '0') {
					toastr.error(data.returnMessage);
				}
			}); 
			ngDialog.closeAll();
		}
	}

	$scope.reSet = function() {
		ngDialog.closeAll();
	}
});