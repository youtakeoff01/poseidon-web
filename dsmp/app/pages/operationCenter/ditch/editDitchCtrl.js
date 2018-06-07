'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-23
 * description 通知渠道-修改
 */
App.controller('editDitchCtrl', function($state, $scope, NgTableParams, ngResource, toastr, ngDialog) {
	if($scope.datetoBehind.booean_ssl == undefined) {
		$scope.datetoBehind.booean_ssl = false;
	} else if($scope.datetoBehind.booean_ssl == "false") {
		$scope.datetoBehind.booean_ssl = false;
	} else if($scope.datetoBehind.booean_ssl == "true") {
		$scope.datetoBehind.booean_ssl = true;
	}
	$scope.create = $scope.datetoBehind.booean_ssl;
	//console.log("create=" + $scope.create);

	$scope.clickSSL = function() {

		console.log("ssl2222=" + $scope.create);
		if($scope.create == true) {
			$scope.create = false;
		} else if($scope.create == false) {
			$scope.create = true;
		}

	}
	$scope.ok = function() {

		if($scope.datetoBehind.channelName != "" && $scope.datetoBehind.channelType.name != "" &&
			$scope.datetoBehind.receiveAcount != "" && $scope.datetoBehind.sendServer != "" &&
			$scope.datetoBehind.port != "" && $scope.datetoBehind.sendAccount != "" &&
			$scope.datetoBehind.emailPassword != "") {
			var param = {
				"id": $scope.datetoBehind.id,
				"channelName": $scope.datetoBehind.channelName,
				"channelType": $scope.datetoBehind.channelType,
				"receiveAcount": $scope.datetoBehind.receiveAcount,
				"sendServer": $scope.datetoBehind.sendServer,
				"port": $scope.datetoBehind.port,
				"booean_ssl": $scope.create,
				"sendAccount": $scope.datetoBehind.sendAccount,
				"emailPassword": $scope.datetoBehind.emailPassword
			};
			ngResource.Update('psdon-web/emailController/updateEmail', {}, param).then(function(data) {
				if(data.returnCode == '1') {

					toastr.success('修改成功');
				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
					$state.go('login');
				} else {
					toastr.error('修改失败');
				}
				$scope.tableParams.reload();
				ngDialog.closeAll();
			});
		} else {

			toastr.error('请填写必填项');
		}

	}

});