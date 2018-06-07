'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-23
 * description 数据权限-添加
 */
App.controller('addPermissionCtrl', function($state,$scope, NgTableParams, ngDialog, ngResource, toastr) {
	
	$scope.permInfo = {
		nameInfo: {}
	};
	$scope.dataList = []; // 用于存放所有访问数据
	$scope.hiveNameArray = [];   // 用于存储数据库列表

	// 查询用户
	$scope.users = []; 
	ngResource.Query('psdon-web/usercontroller/listAllUsers', "").then(function(data) {
		if(data.returnCode == '1') {
			$scope.users = data.returnObject;
		} else if(data.returnCode == overTimeCode) {
			setTimeout(function(){
				ngDialog.closeAll();
			},500)
			setTimeout(function(){
				$state.go('login');
			},1000)
		}
	});

	// 获取hive库名
	$scope.hiveName = [];
	ngResource.Query('psdon-web/hiveTable/getHiveDb').then(function (data) {
		if(angular.isUndefined(data.error)){
			$scope.hiveName = angular.copy(data.data);
			$scope.selected.value = $scope.hiveName[0];  //默认获取第一个
			$scope.hiveNameArray = [$scope.hiveName[0]];
			getHiveName($scope.hiveName[0]);
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
	});

	// 获取表名函数
	function getHiveName(name){
		var dataParam = {
			dbName: name,
		}
		ngResource.Query('psdon-web/hiveTable/select',dataParam).then(function(data){
			if(angular.isUndefined(data.error)){
				$scope.dataList = angular.copy(data.data);
				if(data.returnCode == overTimeCode){
					ngDialog.closeAll();
					$state.go('login');
				}
			} else{
				// 
			}
		})
	}
	
	// 根据库名获取表
	$scope.changeHiveName = function(item){
		$scope.hiveNameArray = [];
		$scope.dataList = [];
		$scope.hiveNameArray.push(item);
		$scope.permInfo.hasPerTab = [];
		getHiveName(item);
	}

	// 数据访问选择
	/* $scope.changeEmployeeTag = function(emp) {
		if(emp.flag == 1) {
			emp.flag = 0;
			$scope.changeUser.splice(emp, 1);
		} else {
			emp.flag = 1;
			$scope.changeUser.push(emp);
		}
	}; */

	// 数据权限新增提交
	$scope.ok = function() {
		var postBody;
		// 用户多选
		var userbody = [];
		for(var j = 0; j < $scope.permInfo.nameInfo.length; j++) {
			userbody.push($scope.permInfo.nameInfo[j].userName);
		}
		// 表格多选
		var tableBody = [];
		for(var j = 0; j < $scope.permInfo.hasPerTab.length; j++) {
			tableBody.push($scope.permInfo.hasPerTab[j]);
		}
		// 判断功能权限是否为空
		if(checkSelect.length>0){
			// 判断账号和表格是否为空
			if($scope.permInfo.nameInfo.length>0 && $scope.permInfo.hasPerTab.length>0 ){
				postBody = {
					'user': userbody,  // 账号
					'databases': $scope.hiveNameArray, //库名
					'tables': tableBody,  // 表
					'type': checkSelect,  // 权限
					'columns':  ["*"]  // 列
				}
				ngResource.Add('psdon-web/hiveDataPermission/add', {}, postBody).then(function(data) {
					if(data.returnCode == '000000') {
						$scope.tableParams.reload();
						toastr.success('新增成功');
					} else if(data.returnCode == overTimeCode) {
						ngDialog.closeAll();
						$state.go('login');
					} else {
						$scope.tableParams.reload();	
						toastr.error(data.returnMessage);
					}
					$scope.selected=[];
					ngDialog.closeAll();
				});
			}else{
				toastr.error('请填写必填项！');
			} 
		}else{
			toastr.error('请填写必填项！');
		}
	}

	//对象
	/* var dataParam = {
		'metaDataType': 'hive'
	};
	ngResource.Query('psdon-web/metaDataController/getHiveOrHbaseTableNames', dataParam).then(function(data) {
		if(data.returnCode == '1') {

			var dataArr = data.returnObject;
			for(var i = 0; i < dataArr.length; i++) {
				var temp = dataArr[i];
				var user = new Object({});
				user.dataName = dataArr[i];
				user.flag = 0;
				$scope.dataList.push(user);
			}
			// console.log($scope.dataList);
		} else {

		}
	}); */
		
	//  权限
	$scope.perCheck = {};  // 用于存放权限
	var checkSelect = [];
	$scope.changeCheckbox = function(key) {
		checkSelect = [];
		for(var item in $scope.perCheck){
			if($scope.perCheck[item] != false){
				checkSelect.push($scope.perCheck[item]);
			}
		}
	}

	// 查询hive表名是否存在  目前不用
	/* $scope.seachTableName = function() {
		if($scope.tabInfo.tabelName != "" && $scope.tabInfo.tabelName != "") {
			var tableNameData = {
				'tableName': $scope.tabInfo.tabelName,
				'metaDataType': $scope.tabInfo.metaDataType
			};
			ngResource.Query('psdon-web/metaDataController/getHiveHbase', tableNameData).then(function(data) {
				// console.log(data);
			});
		}
	} */

});