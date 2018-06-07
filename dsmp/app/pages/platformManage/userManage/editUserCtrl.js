'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-19
 * description 平台用户-用户管理
 */
App.controller('editUserCtrl', function($state, $scope, ngDialog, ngResource, toastr, $rootScope) {
	console.log($scope.editUserData);
	$scope.editUserData.group={
		"id":$scope.editUserData.groupId,
		"groupName":$scope.editUserData.groupName
	};
	$scope.editUserData.role={
		"id":$scope.editUserData.roleId,
		"roleName":$scope.editUserData.roleName
	};
	$scope.userState = [
		{id: 1, name: '可用'},
		{id: 2, name: '禁用'}
	]
	if($scope.editUserData.status == 0) {
		$scope.editUserData.statusName = $scope.userState[0];
	} else if($scope.editUserData.status == 1) {
		$scope.editUserData.statusName = $scope.userState[1];
	}

	$scope.ok = function() {
		if(!$scope.editUserData.email || !$scope.editUserData.userType || $scope.editUserData.userName == undefined || $scope.editUserData.realName == undefined || $scope.editUserData.roleName == undefined) {
			toastr.error('请填写必填项');
		} else {
			var statusTemp = $scope.editUserData.statusName.name;
			if(statusTemp == '可用') {
				statusTemp = 0;
			} else if(statusTemp == '禁用') {
				statusTemp = 1;
			}
			var postBody = {
				"id": $scope.editUserData.id,
				"userName": $scope.editUserData.userName,
				// "password": $scope.editUserData.password,
				"realName": $scope.editUserData.realName,
				// "groupId": $scope.editUserData.group.id,  // 暂时不用
				// "groupName": $scope.editUserData.group.groupName,
				"email":$scope.editUserData.email,
				"userType":$scope.editUserData.userType,
				"roleId": $scope.editUserData.role.id,
				"roleName": $scope.editUserData.role.roleName,
				"status": statusTemp
			};
			console.log(postBody)
			ngResource.Update('psdon-web/usercontroller/updateUser', {}, postBody).then(function(data) {
				if(data.returnCode == '1') {

					ngDialog.closeAll();
					$scope.tableParams.reload();
					toastr.success('修改成功');
				} else {

					ngDialog.closeAll();
					$scope.tableParams.reload();
					toastr.error('修改失败');
				}
			});
		}
	}
});