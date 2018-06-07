'use strict';
/*
 * auth 杨丽娟
 * date 2017-09-27
 * description 机器执行日志
 */
App.controller('machineExectLogCtrl', function($interval, $state, $scope, NgTableParams, ngDialog, ngResource, toastr) {

	console.log($scope.execteInfo);
	var timer = $interval(function() {
		searchlogData();
	}, 1000, 10);

	function searchlogData() {
		var param = {
			'userId': $scope.execteInfo.account,
			'taskId': $scope.execteInfo.id
		}
		ngResource.Query('psdon-web/comController/getAIInfo', param).then(function(data) {
			if(data.returnCode == '1') {
				$scope.logData = data.returnObject.message;
				console.log($scope.logData);
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}
		});

	}

	$scope.refresh = function() {
		searchlogData();
	}
	$scope.ok = function() {
		ngDialog.closeAll();
		$interval.cancel(timer);
	}
	$scope.reSet = function() {
		ngDialog.closeAll();
	}


});