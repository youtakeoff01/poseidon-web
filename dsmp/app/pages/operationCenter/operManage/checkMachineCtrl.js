'use strict';
/*
 * auth 杨丽娟
 * date 2017-11-15
 * description 数据查看
 */
App.controller('checkMachineCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
	$scope.ok = function() {
		ngDialog.closeAll();
	}
});