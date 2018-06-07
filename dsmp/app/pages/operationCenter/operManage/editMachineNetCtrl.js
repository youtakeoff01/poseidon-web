'use strict';
/*
 * auth 杨丽娟
 * date 2017-09-27
 * description 修改节点
 */
App.controller('editMachineNetCtrl', function($rootScope, $state, $scope, ngDialog, ngResource, toastr) {
	$scope.editData = [];
	$scope.editData.title = $rootScope.editMachineName;

	$scope.ok = function() {
		$rootScope.updateMachineNode = $scope.editData.title;
		$scope.$emit("editMachineNode");
		ngDialog.closeAll();
	}

});