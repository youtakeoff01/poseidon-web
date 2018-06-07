'use strict';

App.controller('addLibrayCtrl', function($state, $scope,ngDialog, ngResource, toastr) {
	$scope.addliaInfo = {
		tabelName: '',
	};

	/* 	表单验证 */
	// 库名合规性
	$scope.seachLiaName =  function(name){
		if(name == ''){

		}else if(name == undefined){
			toastr.error("库名包括大小写、数字、下划线，且只能以字母开头!");
		}
	}
	// 库名是否填写
	$scope.ok = function() {
		var params = {
			'dbName': $scope.addliaInfo.tabelName,
		};
		if($scope.addliaInfo.tabelName == ''){
			toastr.error("请填写库名");
		}else if($scope.addliaInfo.tabelName == undefined){
			// toastr.error("库名包括大小写、数字、下划线，且只能以字母开头!");
		}else{
			ngResource.Update('psdon-web/hiveTable/createHiveDb', {}, params).then(function(data) {
				if(data.returnCode == '000000') {
					$scope.tableParams.reload();
					toastr.success('新增成功');
					ngDialog.closeAll();
				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
					$state.go('login');
				} else if(data.returnCode == '999999'){
					toastr.error(data.returnMessage);
					ngDialog.closeAll();
				}
	
			});
		}	
		
	};
});