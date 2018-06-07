'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-23
 * description 权限管理-修改
 */
App.controller('editPermissionCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
	$scope.editPer = {};   // 存放默认获取的表名
	// 默认获取数据
		/* 获取库名 star */
	$scope.hiveName = [];
	$scope.hiveNameArray = [];   // 用于存储数据库列表
	ngResource.Query('psdon-web/hiveTable/getHiveDb').then(function (data) {
		if(angular.isUndefined(data.error)){
			$scope.hiveName = angular.copy(data.data);
			// 默认获取库名
			$scope.hiveNameArray = $scope.editPerm.databases[0];
			$scope.selected.value = $scope.editPerm.databases[0];
			if(data.returnCode == overTimeCode){
				setTimeout(function(){
					ngDialog.closeAll();
				},500)
				setTimeout(function(){
					$state.go('login');
				},1000)
			}
		} else{
			// 
		}
	});
		/* 获取库名 end */

		/* 获取表名 star*/
	// 获取表名函数
	function getHiveName(name){
		var dataParam = {
			dbName: name,
		}
		ngResource.Query('psdon-web/hiveTable/select',dataParam).then(function(data){
			if(angular.isUndefined(data.error)){
				$scope.dataList = data.data;
				if(data.returnCode == overTimeCode){
					setTimeout(function(){
						ngDialog.closeAll();
					},500)
					setTimeout(function(){
						$state.go('login');
					},1000)
				}
			} else{

			}
		})
	}
	// 默认获取表名
	$scope.editPer.hasPerTab = $scope.editPerm.tables;
		/* 获取表名 end*/

		/*  默认数据权限和功能权限 star */
	$scope.editPerCheck = {};  // 用于存放默认权限
	$scope.editPerm.type = $scope.editPerm.type.split('、');
	for(var i in $scope.editPerm.type){
		$scope.editPerCheck[$scope.editPerm.type[i]] =  $scope.editPerm.type[i];
	}
		/*  默认数据权限和功能权限 end */
	getHiveName($scope.editPerm.databases[0]);
	// 库名选择
	$scope.changeHiveName = function(item){
		$scope.editPer.hasPerTab = [];
		$scope.hiveNameArray = [];
		$scope.dataList = [];
		$scope.hiveNameArray.push(item);
		getHiveName(item);
	}
	//权限多选
	var checkSelect = $scope.editPerm.type;
	$scope.changeCheckbox = function() {
		checkSelect = [];
		for(var item in $scope.editPerCheck){
			if($scope.editPerCheck[item] != false){
				checkSelect.push($scope.editPerCheck[item]);
			}
		}
	}
	
	$scope.ok = function() {
		var postBody = "";
		var userBody = [];
		var tableBody = [];
		var perBody = [];
		userBody = $scope.editPerm.user;  // 用户名
			// 表多选
		for(var j = 0; j < $scope.editPer.hasPerTab.length; j++) {
			tableBody.push($scope.editPer.hasPerTab[j]);
		}
		if(tableBody.length == 0 || checkSelect.length == 0) {
			toastr.error("请填写必填项！");
		} else {
			postBody = {
				'user': userBody,
				'databases': $scope.hiveNameArray,
				'tables': tableBody,
				'type': checkSelect,
				'name': $scope.editPerm.name,   // 策略名
				'serviceName': $scope.editPerm.serviceName,  // 服务名
				'columns':  ["*"]  // 列
			}
			ngResource.Update('psdon-web/hiveDataPermission/update', {}, postBody).then(function(data) {
				if(data.returnCode == '000000') {
					$scope.tableParams.reload();
					toastr.success('修改成功');
				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
					$state.go('login');
				} else {
					$scope.tableParams.reload();
					toastr.error(data.returnMessage);
				}
				ngDialog.closeAll();
			}); 
		} 
	}

});