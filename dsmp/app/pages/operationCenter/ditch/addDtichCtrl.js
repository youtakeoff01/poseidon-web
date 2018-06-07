'use strict';
/*
 * auth 杨丽娟
 * date 2017-06-16
 * description 通知渠道-新增
 */
App.controller('addDitchCtrl', function($state, $scope, NgTableParams, ngResource, toastr, ngDialog) {
	$scope.addDitchInfo = {};

	$scope.ditchType = [{
		id: '1',
		name: 'EMAIL'
	}];
	$scope.searchChannelName = function() {
		if($scope.addDitchInfo.channelName) {

			var tableNameData = {
				'channelName': $scope.addDitchInfo.channelName
			};
			ngResource.Query('psdon-web/emailController/listEmailsAll', tableNameData).then(function(data) {
				$scope.submitCode = data.returnCode;
				if($scope.submitCode == 1) {
					toastr.error("该渠道已经存在,不允许创建！");
				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
					$state.go('login');
				}
			});
		}else{
			
		}
	}

	$scope.ok = function() {
		if($scope.addDitchInfo.channelName != undefined && $scope.addDitchInfo.channelType != undefined &&
			$scope.addDitchInfo.receiveAcount != undefined && $scope.addDitchInfo.sendServer != undefined &&
			$scope.addDitchInfo.port != undefined && $scope.addDitchInfo.sendAccount != undefined &&
			$scope.addDitchInfo.emailPassword != undefined) {

			if($scope.addDitchInfo.channelName != "" && $scope.addDitchInfo.channelType != "" &&
				$scope.addDitchInfo.receiveAcount != "" && $scope.addDitchInfo.sendServer != "" &&
				$scope.addDitchInfo.port != "" && $scope.addDitchInfo.sendAccount != "" &&
				$scope.addDitchInfo.emailPassword != "") {
				if($scope.submitCode != 0) {
					// toastr.error("该渠道已经存在,不允许新增！");
				} else {

					var param = {
						"channelName": $scope.addDitchInfo.channelName,
						"channelType": $scope.addDitchInfo.channelType.name,
						"receiveAcount": $scope.addDitchInfo.receiveAcount,
						"sendServer": $scope.addDitchInfo.sendServer,
						"port": $scope.addDitchInfo.port,
						"booean_ssl": $scope.addDitchInfo.booean_ssl,
						"sendAccount": $scope.addDitchInfo.sendAccount,
						"emailPassword": $scope.addDitchInfo.emailPassword 
					};
					ngResource.Add('psdon-web/emailController/insertEmail', {},param).then(function(data) {
						if(data.returnCode == '1') {
							
							toastr.success('新增成功');
						} else if(data.returnCode == overTimeCode) {
							ngDialog.closeAll();
							$state.go('login');
						} else {
							toastr.error(data.returnMessage);
						}
						$scope.selected=[];
						$scope.tableParams.reload();
						ngDialog.closeAll();
					});
				}
			} else {

				toastr.error('请填写必填项');
			}
		} else {

			toastr.error('请填写必填项');
		}

	};
});