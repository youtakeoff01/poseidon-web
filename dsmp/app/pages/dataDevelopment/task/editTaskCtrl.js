'use strict';
/* auth 杨丽娟
 * date 2017-08-09
 * description 提交任务
 */
App.controller('editTaskCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
	$scope.typeData = [{
		id: '1',
		name: "STORM"
	}, {
		id: '2',
		name: "SPARK"
	},{
		id: '3',
		name: 'SQOOP'
	}];
	$scope.required = true;
	$scope.fdhidden = false;
	$scope.fdMust = '';
	// SQOOP类型  不需要入口类、系统参数， 用户参数为非必填项
	$scope.typeChange = function(type){
		if(type.name == 'SQOOP'){
			$scope.fdhidden = true;
			$scope.fdMust = 'true';
		}else{
			$scope.fdhidden = false;
			$scope.fdMust = '';
		}
	}
	$scope.taskData = [];
	//名称的校验
	$scope.checkName = function() {
		if($scope.taskData.name){
			var param = {
				'taskName': $scope.taskData.name,
				'taskType': $scope.taskData.type.name
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
	}
	
	$scope.ok = function() {
		if($scope.taskData.type){
			var param = {
				"jarInfoEntity": {
					"id": $scope.taskRow.id,  // 第一个id
					'jarPath':$scope.taskRow.jarPath, //第一个jarPath
				},
				"latestTaskEntity": {
					"taskName": $scope.taskData.name,  // 配置时的任务名称
					"taskType": $scope.taskData.type.name  // 配置时的任务类型
				},
				"taskAttributeEntity": {
					"entryClass": $scope.taskData.enclass,  // 入口类
					"systemParam": $scope.taskData.system,  // 系统参数
					"userParam": $scope.taskData.user   // 用户参数
				}
			}
		}
		if($scope.fdhidden == false){
			console.log($scope.taskData.name)
			if(angular.isUndefined($scope.taskData.type) || angular.isUndefined($scope.taskData.name) ||angular.isUndefined($scope.taskData.enclass) || angular.isUndefined($scope.taskData.system) || angular.isUndefined($scope.taskData.user)){
				toastr.error('请填写必填项');
			} else {
				ngResource.Query('psdon-web/tasksubmitcontroller/submitJarTask', param).then(function(data) {
					if(data.returnCode == '1') {
						toastr.success('任务配置成功');
					} else if(data.returnCode == overTimeCode) {
						ngDialog.closeAll();
						$state.go('login');
					} else if(data.returnCode == '0') {
						toastr.error(data.returnMessage);
					}
				});
				ngDialog.closeAll();
			}
		} else {
			if(angular.isUndefined($scope.taskData.type) || angular.isUndefined($scope.taskData.name)){
				toastr.error('请填写必填项');
			}else{
				ngResource.Query('psdon-web/tasksubmitcontroller/submitJarTask', param).then(function(data) {
					if(data.returnCode == '1') {
						toastr.success('任务配置成功');
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
	}

	$scope.reSet = function() {
		ngDialog.closeAll();
	}
});