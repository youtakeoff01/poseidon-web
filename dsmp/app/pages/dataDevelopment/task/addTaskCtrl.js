'use strict';
/* auth 杨丽娟
 * date 2017-08-09
 * description 提交任务
 */
App.controller('addTaskCtrl', function(Uploader, $state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
	$scope.taskData = [];
	$scope.ok = function() {

		var fileIndex = document.getElementsByName("fileUpload");
		//		var paramsData = new FormData();
		//		paramsData.append('uploadFile', fileIndex[0].files[0]);
		Uploader.uploadData(base_url + 'psdon-web/tasksubmitcontroller/insertTaskJar', fileIndex[0].files[0]).then(function(data) {
			if(data.data.returnCode == '1') {
				toastr.success('上传成功');
				$scope.tableParams.page(1);
				$scope.tableParams.reload();
			} else if(data.data.returnCode == '0'){
				toastr.error(data.data.returnMessage);
			} else if(data.data.returnCode == overTimeCode) {
				ngDialog.closeAll();
				$state.go('login');
			}
		});
		ngDialog.closeAll();
	}

	$scope.reSet = function() {
		ngDialog.closeAll();
	}
});