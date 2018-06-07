'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-19
 * description 平台用户-用户组管理
 */
App.controller('editGroupUserCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr, $rootScope) {

	//提交
	$scope.ok = function() {
		if($scope.editGroupData.groupName == undefined || $scope.editGroupData.groupDesc == undefined) {
			toastr.error('请填写必填项');
		} else {
			var postBody = "";
			postBody = $scope.editGroupData;
			ngResource.Update('psdon-web/userGroupController/updateUsergroup', {}, postBody).then(function(data) {
				if(data.returnCode == '1') {
					$scope.tableParams.reload();
					toastr.success('修改成功');
				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
					$state.go('login');
				} else {
					$scope.tableParams.reload();
					toastr.error('修改失败');
				}
				ngDialog.closeAll();
			});
		}
	}

});