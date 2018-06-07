'use strict';
/*
 * auth 杨丽娟
 * date 2017-09-27
 * description 修改节点
 */
App.controller('editNetCtrl', function($rootScope, $state, $scope, ngDialog, ngResource, toastr) {
	$scope.editData = [];
	$scope.editData.title = $rootScope.editName;
	$scope.ok = function() {
		$rootScope.updateNode = $scope.editData.title;
		$scope.$emit("editNode");
		ngDialog.closeAll();
	}

});