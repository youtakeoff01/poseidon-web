//'use strict';
/*
 * auth 杨丽娟
 * date 2017-09-27
 * description 节点日志
 */
App.controller('netLogCtrl', function($rootScope, $state, $scope, ngDialog, ngResource, toastr) {

	var machineName = "";
	var checkDemo = [];

	var websocket = "";

	var messageBox;
	var timestamp = Date.parse(new Date());

	function searchlogData() {
		console.log("节点id=" + $scope.allOptionData);
		var logParam;
		if($scope.netLog == 'c2') {
			for(var j = 0; j < $scope.allOptionData.length; j++) {
				if($scope.allOptionData[j].comNum == $scope.netLogID2) {
					checkDemo.push($scope.allOptionData[j]);
				}
			}
			logParam = {
				'userName': window.sessionStorage.accountName,
				'taskName': $rootScope.machineName,
				'optsEntity': checkDemo
			}

		} else {
			for(var j = 0; j < $scope.allOptionData.length; j++) {
				if($scope.allOptionData[j].comNum == $scope.netLogID1) {
					checkDemo.push($scope.allOptionData[j]);
				}
			}

			logParam = {
				'userName': window.sessionStorage.accountName,
				'taskName': "",
				'optsEntity': checkDemo
			}
		}

		ngResource.Query('psdon-web/comController/getAIComLog', logParam).then(function(data) {
			if(data.returnCode == '1') {
				messageBox.innerHTML = data.returnObject+ '<br />';
				messageBox.scrollTop = messageBox.scrollHeight;

			} else if(data.returnCode == overTimeCode) {
				ngDialog.closeAll();
				$state.go('login');
			}
		});

	}

	$scope.refresh = function() {
		searchlogData();
	}
	$scope.ok = function() {
		ngDialog.closeAll();
		document.querySelector('#menu').style.display = "none";
		document.querySelector('#menuDetail').style.display = "none";
	}
	$scope.reSet = function() {
		ngDialog.closeAll();
		document.querySelector('#menu').style.display = "none";
		document.querySelector('#menuDetail').style.display = "none";
	}

	$scope.load = function() {
		searchlogData();
		messageBox = window.document.getElementById('netLogDiv');

	};

});