'use strict';
/*
 * auth zhangtingting_
 * date 2017年5月3日 19:35:16
 * description 平台用户-用户组管理
 */
App.controller('userGroupCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr, $rootScope) {

	$scope.queryData = [{}];
	var datetoBehind = [];
	//修改的数据源
	$scope.editGroupData = [];
	var actionType = [];
	$scope.addUserGroupData = [];

	var tableData = [];

	//添加筛选条件
	var searchName = "";
	$scope.dataSearch = function() {
		searchName = $scope.searchKey;
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
		//		console.log(item);
	}

	$scope.tableParams = new NgTableParams({
		page: 1,
		count: 10,
		sorting: {}
	}, {
		counts: [],
		total: tableData.length,
		getData: function($defer, params) {
			var param = {
				'startPage': params.page(),
				'count': params.count(),
				'groupName': searchName
			};
			ngResource.Query('psdon-web/userGroupController/listUsergroup', param).then(function(data) {
				if(data.returnCode == '1') {
					$scope.queryData = data.returnObject.userGroupEntitys;
					params.total(data.returnObject.countAll);
					$defer.resolve($scope.queryData);
				} else if(data.returnCode == overTimeCode) {
					$state.go('login');
				}
			});
		}
	});
	/*确认修改*/
	$scope.ok = function() {

		if(actionType == 'delete' || actionType == 'batchDelete') {
			var postBody = [];
			if(actionType == 'batchDelete') {
				angular.forEach($scope.selected, function(data, index, array) {
					if(data == true) {
						postBody.push({
							'id': index,
						});
					}
				});
			} else if(actionType == 'delete') {
				postBody.push({
					'id': datetoBehind.id
				});
			}

			ngResource.Delete('psdon-web/userGroupController/deleteUsergroup', postBody).then(function(data) {
				if(data.returnCode == '1') {
					toastr.success('删除成功');
                    $scope.selected=[];
				} else if(data.returnCode == overTimeCode) {
					$state.go('login');
				} else {
					toastr.error('删除失败');
				}
				ngDialog.closeAll();
				$scope.tableParams.page(1);
				$scope.tableParams.reload();
			});
		}

	};
	/*批量删除*/
	$scope.selected = [];
	$scope.selectAll = function(isSelectAll) {
		for(var i = 0; i < $scope.queryData.length; i++) {
			if(isSelectAll == true) //全选
			{
				$scope.selected[$scope.queryData[i].id] = true;

			} else {
				$scope.selected[$scope.queryData[i].id] = false;

			}

		}
	};
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
				$scope.dialogMessage = "确定批量删除该数据源?";
				ngDialog.open({
					scope: $scope,
					width: 400,
					template: 'app/pages/common/warning.html'
				});
			} else{
				toastr.success('请选择删除数据');
			}

		} else {
			toastr.success('请选择删除数据');
		}

	};
	/*删除部门*/
	$scope.deleteUserGroup = function(item) {
		datetoBehind = item;
		actionType = "delete";
		$scope.dialogTitle = "提示";
		$scope.dialogMessage = "确定删除该用户组?";
		ngDialog.open({
			scope: $scope,
			width: 400,
			template: 'app/pages/common/warning.html'
		});
	};
	/*添加数据源*/
	$scope.addGroupUser = function() {
		$scope.dialogTitle = "新增";
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/platformManage/userGroup/addGroupUser.html',
			controller: 'addGroupUserCtrl'
		});
	};
	$scope.editGroupUser = function(item) {
		$scope.dialogTitle = "编辑";
		$scope.editGroupData = item;
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/platformManage/userGroup/editGroupUser.html',
			controller: 'editGroupUserCtrl'
		});
	};
});