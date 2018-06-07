'use strict';
/**
 * Created by Lishanming_ on 2017年5月9日 13:55:16.
 */
App.controller('RenameFileCtrl',function($state,$scope,ngDialog,ngResource,toastr){
		
		$scope.fileInfo = {
			'newName':$scope.RenameObject.name
		};
		
		$scope.ok = function(){
		
		
		var postBody = {
			'srcPath':$scope.RenameObject.srcPath,
			'fileName':$scope.fileInfo.newName
		};
		
		ngResource.Update('psdon-web/InfoDocument/renameFile',{},postBody).then(function(data){
		
			if(data.returnCode == '000000') {
				$scope.getFiles();
				ngDialog.closeAll();
				toastr.success(data.retMessage);
			} else if(data.returnCode == '000007') {
				toastr.error(data.retMessage);
			}else if(data.returnCode == overTimeCode) {
				ngDialog.closeAll();
				$state.go('login');
			}
		});
	
		};
});
