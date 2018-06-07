'use strict';
/*
 * auth 杨丽娟
 * date 2017-09-25
 * description 机器学习保存
 */

App.controller('saveMachineCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr, $rootScope) {
	$scope.syncData = [];
	//校验名称
	$scope.checkMachineName = function() {
		if($scope.syncData.name != undefined &&$scope.syncData.name != "") {
			var param = {
				'taskName': $scope.syncData.name
			};
			ngResource.Query('psdon-web/TaskController/checkTask', param).then(function(data) {
				$scope.returnCode = data.returnCode;
				$scope.returnMessage=data.returnMessage;
				if(data.returnCode == '0') {
					toastr.error(data.returnMessage);

				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
					$state.go('login');
				}
			});
		}

	}

	//点击确定
	$scope.ok = function() {
		if($scope.returnCode == '0') {
			toastr.error($scope.returnMessage);

		} else if($scope.syncData.name != undefined && $scope.syncData.remark != undefined && $scope.syncData.name != "" && $scope.syncData.remark != "") {
			var params = {
				"taskName": $scope.syncData.name,
				"remarks": $scope.syncData.remark,
				"json": $scope.jsonData,
				"optsEntity": $scope.allOptionData
			}
			ngResource.Query('psdon-web/comController/saveAITask', params).then(function(data) {
				if(data.returnCode == '1') {
					toastr.success("保存成功");
				} else if(data.returnCode == '0') {
					toastr.error("保存失败");
				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
					$state.go('login');
				}
				ngDialog.closeAll();
			});
			console.log(angular.toJson(params));
		} else {

			toastr.error("请填写必填项！");

		}

	}
});