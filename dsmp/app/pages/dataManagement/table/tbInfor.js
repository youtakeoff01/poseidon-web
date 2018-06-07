'use strict';
/*
 * auth yx
 * date 2017-11-27
 * description 表管理  表信息
 */
App.controller('tableInforCtrl', function($state, $scope, $rootScope, NgTableParams, ngDialog, ngResource, toastr) {
	var param = {};
	var actionType = [];
	$scope.tabData = [];
	var tableData = [];
	var datetoBehind = {};
	$scope.tabInfo = {};
	$rootScope.tableInfo = {};  // 存放表字段信息

	// 条件查询函数
	var searchName = "";
	$scope.dataSearch = function() {
		param.tableName = $scope.searchKey,
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
	}

	$scope.reSet = function() {
		$scope.tableParams.reload();
	}
	
	$scope.tableParams = new NgTableParams({
		page: 1,
		count: 10,
		sorting: {}
	}, {
		counts: [],
		total: tableData.length,
		getData: function($defer, params) {
			ngResource.Add('psdon-web/hiveDataPermission/selectTables',{}, param).then(function(data) {
				if(data.returnCode){
					// 查询失败
					if(data.returnCode == overTimeCode){
						$state.go('login');
					}
				} else {
					$scope.tabData = angular.copy(data.data);
					$scope.isAdmin = data.isAdmin;
					for(var i=0; i<$scope.tabData.length; i++){
						for(var j=0; j<$scope.tabData[i].tablesType.length; j++){
							$scope.tabData[i].tablesType[j].user = $scope.tabData[i].tablesType[j].user.join('、')
							$scope.tabData[i].tablesType[j].type = $scope.tabData[i].tablesType[j].type.join('、')
							if($scope.tabData[i].tablesType[j].type.indexOf('alter')>-1){
								$scope.tabData[i].tablesType[j].alter = true;
							}else{
								$scope.tabData[i].tablesType[j].alter = false;
							}
							if($scope.tabData[i].tablesType[j].type.indexOf('drop')>-1){
								$scope.tabData[i].tablesType[j].drop = true;
							}else{
								$scope.tabData[i].tablesType[j].drop = false;
							}
							if($scope.tabData[i].tablesType[j].type.indexOf('all')>-1){
								$scope.tabData[i].tablesType[j].alter = true;  // 可修改
								$scope.tabData[i].tablesType[j].drop = true; // 可删除
							}
						}
						if($scope.tabData[i].tablesType[0].type.indexOf('create')>-1){
							$scope.tabData[i].create = true;
						}
						if($scope.tabData[i].tablesType[0].type.indexOf('all')>-1){
							$scope.tabData[i].create = true;
						}
					}
					// params.total(data.returnObject.countAll);  
					$defer.resolve($scope.tabData);
				}
			}); 
		}
	});

	/*添加新增数据*/
	$scope.createShow = false;

	// 库新建
	$scope.addLibrary = function(){
		actionType = "libAdd";
		$scope.dialogTitle = "新增";
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/dataManagement/table/addLibray.html',
			controller: 'addLibrayCtrl'
		});
	}

	// 表新建
	$scope.dbName = '';
	$scope.addTable = function(item) {
		$scope.dbName = item.databases[0];
		actionType = "add";
		$scope.dialogTitle = "新增";
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/dataManagement/table/addTable.html',
			controller: 'addTableCtrl'
		});
	};

	// 修改表
	$scope.editTable = function(dbName, tab) {
		$scope.dialogTitle = "编辑";
		$scope.editTableInfo = angular.copy(tab);
		$scope.editDbName = dbName;
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/dataManagement/table/editTable.html',
			controller: 'editTableCtrl'
		});
	};

	// 删除表
		// 删除表弹框
	$scope.deleteTable = function(dbName, tabName) {
		datetoBehind.dbName = dbName;
		datetoBehind.tabName = tabName;

		$scope.dialogTitle = "提示";
		$scope.dialogMessage = "确定删除该表数据?";
		ngDialog.open({
			scope: $scope,
			width: 400,
			template: 'app/pages/common/warning.html'
		});
	};
		// 删除表函数
	$scope.ok = function() {
		var postBody = {
			dbName: datetoBehind.dbName,
			tabelName: datetoBehind.tabName 
		}
		ngResource.Delete('psdon-web/hiveTable/delete', postBody).then(function(data) {
			if(data.returnCode == '000000') {
				toastr.success('删除成功');
				$scope.selected=[];
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			} else if(data.returnCode == '999999'){
				toastr.error(data.returnMessage);
			}
			ngDialog.closeAll();
			$scope.tableParams.page(1);
			$scope.tableParams.reload();
		});
	};

	// 点击跳转到表详情信息页面
	$rootScope.guId;   // 获取血缘关系ID
	$rootScope.dbName = null;
	$rootScope.tbName = null;
	$scope.jumpToDet = function(library,table){
		var tabDelParam = {};
		// 获取库名表名 到  详情页  数据预览这个接口需要
		$rootScope.dbName = library;
		$rootScope.tbName = table;
		
		tabDelParam.tbName = table;
		tabDelParam.dbName = library;
		$rootScope.guId = '';
		ngResource.Add('psdon-web/lineage/getGuid',{}, tabDelParam).then(function(data) {
			if(data.returnCode == '1') {
				$rootScope.guId = data.returnObject.guid;
				// 获表字段信息
				$scope.getTableFieldInfo();
			} else if(data.returnCode == overTimeCode) {	
				$state.go('login');
			} else {	
				toastr.error(data.returnMessage);
			}
		});
		$rootScope.tabChge = false; 
	};

	 // 表字段信息函数
	$scope.getTableFieldInfo = function(){
		var param = {
				guid: $rootScope.guId,
		}
		$scope.tableParams = new NgTableParams({
				page: 1,
				count: 1000,
				sorting: {}
		},{
				counts: [],
				getData: function($defer, params) {
					ngResource.Query('psdon-web/lineage/getSchema', param).then(function(data) {
							if(data.returnCode == '1') {
									$rootScope.tableInfo = data.returnObject;
									params.total(data.returnObject.countAll);
									$defer.resolve($scope.tabData);
							} else if(data.returnCode == overTimeCode) {
									$state.go('login');
							}
					});
				}
			}
		); 
	}

});