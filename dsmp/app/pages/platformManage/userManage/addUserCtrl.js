'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-19
 * description 平台用户-用户组管理
 */
App.controller('addUserCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr, $rootScope) {

	$scope.addUserData = [];
	$scope.returnCode = "";
	$scope.userState = [
		{id: 1, name: '可用'},
		{id: 2, name: '禁用'}
	]
	$scope.ok = function() {
		if(!$scope.editUserData.email || !$scope.editUserData.userType || $scope.addUserData.userName == undefined || $scope.addUserData.status == undefined ||
			$scope.addUserData.realName == undefined || $scope.addUserData.roleName == undefined) {
			toastr.error('请填写必填项');
		} else {
			var statusTemp = $scope.addUserData.status.name;
			if(statusTemp == '可用') {
				statusTemp = 0;
			} else if(statusTemp == '禁用') {
				statusTemp = 1;
			}
			if($scope.returnCode == '1') {
				var postBody = {
					"userName": $scope.addUserData.userName,
					// "password": $scope.addUserData.password,
					"realName": $scope.addUserData.realName,
					// "groupId": $scope.addUserData.groupName.id,  // 暂时不用
					// "groupName": $scope.addUserData.groupName.groupName,
          "email":$scope.editUserData.email,
          "userType":$scope.editUserData.userType,
					"roleId": $scope.addUserData.roleName.id,
					"roleName": $scope.addUserData.roleName.roleName,
					"status": statusTemp
				};
				console.log(postBody)
				ngResource.Add('psdon-web/usercontroller/createUser', {}, postBody).then(function(data) {
					if(data.returnCode == '1') {
						$scope.tableParams.reload();
						ngDialog.closeAll();
						toastr.success('新增成功');
						$scope.selected=[];
					} else {
						$scope.tableParams.reload();
						ngDialog.closeAll();
						toastr.error(data.returnMessage);
					}
				});
			} else if($scope.returnCode == '0') {
        toastr.error('该用户已经存在');
			}
		}
	};
	//				
	$scope.seachTableName = function(index) {
		if(index != "") {

			var tableNameData = {
				'userName': index
			};
			ngResource.Query('psdon-web/usercontroller/checkUser', tableNameData).then(function(data) {
				$scope.returnCode = data.returnCode;
				if(data.returnCode == '1') {
					//新建用户接口
				} else if(data.returnCode == '0') {
					//修改用户接口
					$scope.updateID = data.returnObject.id;
          toastr.error('该用户已经存在');
				}

			});
		}
	}

});