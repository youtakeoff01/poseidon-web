'use strict';
/**
 * Created by Lishanming_ on 2017年5月9日 13:55:16.
 */
App.controller('moveFileCtrl', function($state,$scope, ngDialog, ngResource, toastr) {

	var destination = "";

	ngResource.Query('psdon-web/InfoDocument/getDocumentTree', {}).then(function(data) {
		if(data.returnCode == sucessCode) {
			$scope.treeData = data.returnObject;
		} else if(data.returnCode == overTimeCode) {
			ngDialog.closeAll();
			$state.go('login');
		}
	});

	$scope.$on("fileDirChanged", function(event, value) {
		destination = value + '/';
	});

	$scope.ok = function() {

		var postBody = {
			'srcPath': $scope.fileMoveInfo.srcPath,
			'dstPath': destination,
			'fileName': $scope.fileMoveInfo.name
		};

		//这个地方需要判断是‘复制到’还是‘移动到’
		var URL = "";
		if($scope.operationType == 'move') {
			URL = 'psdon-web/InfoDocument/moveFile';
		} else {
			URL = 'psdon-web/InfoDocument/copyFile';
		}

		ngResource.Update(URL, {}, postBody).then(function(data) {
			if(data.returnCode == sucessCode) {

				$scope.getFiles(); //这是由scope继承下来的
				
				toastr.success('文件操作成功');
			} else if(data.returnCode == overTimeCode) {
				ngDialog.closeAll();
				$state.go('login');
			}
			ngDialog.closeAll();
		});
	}

});