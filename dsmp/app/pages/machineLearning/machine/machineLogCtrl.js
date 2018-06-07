//'use strict';
/*
 * auth 杨丽娟
 * date 2017-09-27
 * description 机器日志
 */
App.controller('machineLogCtrl', function($rootScope, $state, $scope, ngDialog, ngResource, toastr) {
	$scope.logData = "";
	var websocket = "";

	var messageBox;
	var timestamp = Date.parse(new Date());

	var params = {
		"json": $scope.jsonData,
		"optsEntity": $scope.allOptionData,
		"taskName": $rootScope.machineName,
		"taskTime": timestamp,
		"pyPort": $rootScope.pyPortModel
	}
	ngResource.Query('psdon-web/comController/executeAIInfo', params).then(function(data) {
		if(data.returnCode == '1') {} else if(data.returnCode == overTimeCode) {
			$state.go('login');
		}
	});

	function searchlogData() {

		var logParam;
		if($scope.mid == 'c2') {
			logParam = {
				"userName": $rootScope.machineAccount,
				"taskName": $rootScope.machineName,
				"taskTime": timestamp,
				"pyPort": $rootScope.pyPortModel
			}
		} else {
			console.log("username="+window.sessionStorage.accountName);
			logParam = {
				"userName": window.sessionStorage.accountName,
				"taskName": "",
				"taskTime": timestamp
			}
		}

		ngResource.Query('psdon-web/comController/getAILog', logParam).then(function(data) {
			if(data.returnCode == '1') {
				messageBox.innerHTML = data.returnObject + '<br />';
				messageBox.scrollTop = messageBox.scrollHeight;

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
	}
	$scope.reSet = function() {
		ngDialog.closeAll();
	}

	$scope.load = function() {
		searchlogData();
		messageBox = window.document.getElementById('scrollDiv');
	};

});