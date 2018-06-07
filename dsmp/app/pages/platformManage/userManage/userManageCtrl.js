'use strict';
/*
 * auth zhangtingting_
 * date 2017年5月3日 19:35:16
 * description 平台用户-用户管理
 */
App.controller('userManageCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr, $rootScope) {

	$scope.queryData = [{}];
	var datetoUser = [];
	var actionType = [{}];

	$scope.editUserData = []; //用户的修改
	var tableData = [];
	$scope.userListData = [];
	$scope.roleListData = [];

	//查询所有用户组的接口
	ngResource.Query('psdon-web/userGroupController/listAllUserGroup', '').then(function(data) {
		if(data.returnCode == '1') {
			$scope.userListData = data.returnObject;
		} else {

		}
	});
	//所有角色的接口
	ngResource.Query('psdon-web/roleController/roleSelectAll', '').then(function(data) {
		if(data.returnCode == '1') {
			$scope.roleListData = data.returnObject.lists;
		} else {

		}
	});

	//添加筛选条件
	var searchName = "";
	$scope.dataSearch = function() {
		searchName = $scope.searchKey;
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
		//		console.log(item);
	}

	//表格
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
				'userName': searchName
			};
			ngResource.Query('psdon-web/usercontroller/listUsers', param).then(function(data) {
				if(data.returnCode == '1') {
					$scope.queryData = data.returnObject.users;
					params.total(data.returnObject.countAll);
					$defer.resolve($scope.queryData);
				} else {

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
							// 'id': $scope.queryData[index].id,
							'userName': datetoUser.userName
						});
					}
				});
			} else if(actionType == 'delete') {
				postBody.push({
					'id': datetoUser.id,
					'userName': datetoUser.userName
				});
			}

			ngResource.Delete('psdon-web/usercontroller/deleteUser', postBody).then(function(data) {
				if(data.returnCode == '1') {
					toastr.success('删除成功');
					$scope.selected = [];
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
			if(!isSelectAll) //全选
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
			for(var i = 0; i < $scope.selected.length; i++) {
				if($scope.selected[i] == true) {
					flag = true;
					break;
				};
			}
			if(flag) {
				$scope.dialogTitle = "提示";
				$scope.dialogMessage = "确定批量删除该数据源?";
				ngDialog.open({
					scope: $scope,
					width: 400,
					template: 'app/pages/common/warning.html'
				});
			} else {
				toastr.success('请选择删除数据');
			}

		} else {
			toastr.success('请选择删除数据');
		}

	};
	/*删除部门*/
	$scope.deleteUser = function(item) {
		datetoUser = item;
		actionType = "delete";
		$scope.dialogTitle = "提示";
		$scope.dialogMessage = "确定删除该用户?";
		ngDialog.open({
			scope: $scope,
			width: 400,
			template: 'app/pages/common/warning.html'
		});
	};
	/*添加数据源*/
	$scope.addUser = function() {
		$scope.dialogTitle = "新增";
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/platformManage/userManage/addUser.html',
			controller: 'addUserCtrl'
		})
	};

	//编辑数据
	$scope.editUser = function(item) {
		$scope.editUserData = item;

		$scope.dialogTitle = "编辑";
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/platformManage/userManage/editUser.html',
			controller: 'editUserCtrl'
		});
	};

	//重置密码
	$scope.UpdateUser = function(item) {
		var params = {
			"id": item.id
		}
		ngResource.Query('psdon-web/usercontroller/resetUserPassword', params).then(function(data) {
			if(data.returnCode == '1') {
				toastr.success("默认密码：123456！");
			} else if(data.returnCode == '0') {
				toastr.error(data.returnMessage);
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}
		});
	}
});