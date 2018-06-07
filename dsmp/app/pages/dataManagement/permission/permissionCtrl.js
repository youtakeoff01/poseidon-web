'use strict';
/*
 * auth yanglijuan
 * date 2017-05-27
 * description 数据管理 - 数据权限
 */
App.controller('permissionCtrl', function($filter,$state, $scope, NgTableParams, ngDialog, ngResource, toastr, $rootScope) {
	var actionType;        // 用于判断哪种删除
	$scope.tabData = [];   // 用于存放table数据
	// var tableData = []; // 暂时先不用
	var datetoBehind;      // 用于删除时存数据
	$scope.editPerm = [];  // 用于编辑时存数据
	var param ={ }; // 查询参数
	var tableData = [];
	
	//添加筛选条件
	$scope.dataSearch = function() {
		param.username = $scope.searchKey;
		$scope.tableParams.page(1);
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
			param.pageNo = params.page();
			param.pageSize = params.count();
			ngResource.Add('psdon-web/hiveDataPermission/selectPage', {}, param).then(function(data) {
				if(data.returnCode) {
					// 查询失败
				} else {
					params.total(data.allCount);
					$scope.tabData = angular.copy(data.data);
					for(var i in $scope.tabData){
						$scope.tabData[i].type = $scope.tabData[i].type.join('、')
					}
					$defer.resolve($scope.tabData);
				}
			});
		}
	});

	// 删除 （改后只有单个删除）
	$scope.selected = [];
	$scope.selectAll = function(isSelectAll) {
		for(var i = 0; i < $scope.tabData.length; i++) {
			if(isSelectAll == true) //全选
			{
				$scope.selected[$scope.tabData[i].id] = true;

			} else {
				$scope.selected[$scope.tabData[i].id] = false;

			}

		}
	}; 
	$scope.selectIndex = function(index) {
		console.log($scope.selected[index]);
	}

	/* 批量删除 */
	$scope.batchDelete = function() {
		actionType = 'batchDelete';
		var flag = false;
		if($scope.selected.length > 0) {
			// 判断数据是否选择删除数据
			for(var i=0; i<$scope.selected.length; i++){
				if($scope.selected[i] == true){
					flag = true;
					break;
				};
			}
			if(flag){
				$scope.dialogTitle = "提示";
				$scope.dialogMessage = "确定权限批量删除?";
				ngDialog.open({
					scope: $scope,
					width: 400,
					template: 'app/pages/common/warning.html'
				});
			}else{
				toastr.success('请选择删除数据');
			}
		} else {
			toastr.success('请选择删除数据');
		}
	};

	/* 删除单个数据权限 */
	$scope.deleteTable = function(item) {
		datetoBehind =angular.copy(item);
		actionType = "delete";
		$scope.dialogTitle = "提示";
		$scope.dialogMessage = "确定删除该权限?";
		ngDialog.open({
			scope: $scope,
			width: 400,
			template: 'app/pages/common/warning.html'
		});
	};

	/* 单个删除函数 */
	$scope.ok = function() {
		var postBody = {
			'name': datetoBehind.name,
			'serviceName': datetoBehind.serviceName
		}
		ngResource.Delete('psdon-web/hiveDataPermission/delete', postBody).then(function(data) {
			if(data.returnCode == '000000') {
				toastr.success('删除成功');
				$scope.selected=[];
			} else {
				toastr.error(data.returnMessage);
			}
			  ngDialog.closeAll();
			$scope.tableParams.page(1);
			$scope.tableParams.reload();
		});
		/* if(actionType == 'delete' || actionType == 'batchDelete') {
			var postBody = [];
			var post = [];
			var postNum = [];
			if(actionType == 'batchDelete') {
				angular.forEach($scope.selected, function(data, index, array) {
					if(data == true) {
						postNum.push(index);
					}
				});
				for(var i=0; i<$scope.tabData.length; i++){
					for(var j=0; j<postNum.length; j++){
						var flag = false;
						if(postNum[j] == $scope.tabData[i].id){
							flag = true;
							break;
						}
					}
					if(flag){
						postBody.push({
							'name': $scope.tabData[i].name,   // 策略名
							'serviceName': ''
						});
					}
				}
				// console.log('posybody', postBody);
			} else if(actionType == 'delete') {
				postBody.push({
					"user": datetoBehind.user,
					"type": datetoBehind.type,
					"tables": datetoBehind.tables,
					'name': datetoBehind.name
				});
			}

			ngResource.Delete('psdon-web/policyController/delPolicy', postBody).then(function(data) {
				if(data.returnCode == '1') {
					toastr.success('删除成功');
                    $scope.selected=[];
				} else {
					toastr.error('删除失败');
				}
              	ngDialog.closeAll();
				$scope.tableParams.page(1);
				$scope.tableParams.reload();
			});  */
	};

	/* 权限新增 */
	$scope.addPermission = function() {
		actionType = "add";
		$scope.dialogTitle = "新增";
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/dataManagement/permission/addPermission.html',
			controller: 'addPermissionCtrl'
		});
	};
	
	$scope.editPermission = function(item) {
		actionType = "update";
		$scope.dialogTitle = "编辑";
		$scope.editPerm = angular.copy(item);
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/dataManagement/permission/editPermission.html',
			controller: 'editPermissionCtrl'
		});
	};

});