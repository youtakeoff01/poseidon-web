'use strict';
/*
 * auth 杨丽娟
 * date 2017-08-08
 * description 运维中心-任务管理历史详情
 */
App.controller('opmanageHistoryCtrl', function($rootScope,$state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
	var actionType = [];
	$scope.tabData = [{}];
	var tableData = [];
	var datetoBehind = [];
	$scope.tabInfo = {};

	//对象
	$scope.data = {
		searchState: []
	};
	$scope.stateData = [{
		id: '30',
		name: '运行'
	}, {
		id: '50',
		name: '成功'
	}, {
		id: '60',
		name: '已取消'
	}, {
		id: '70',
		name: '失败'
	}, {
		id: '0',
		name: '新建'
	}];
	$scope.getSelectState = function() {
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
	}

	//添加筛选条件

	$scope.searchKey = $rootScope.HistoryTypeName;
	console.log($scope.searchKey);
	$scope.dataSearch = function() {
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
			var param = {
				'startPage': params.page(),
				'count': params.count(),
				'jobName': $scope.searchKey,
				'jobState': $scope.data.searchState.id
			};
			ngResource.Query('psdon-web/dataTaskHistory/selectList', param).then(function(data) {
				if(data.returnCode == '1') {

					$scope.tabData = data.returnObject.list;

					params.total(data.returnObject.countAll);
					$defer.resolve($scope.tabData);
				} else if(data.returnCode == '0') {
					toastr.error("搜索失败！");
					$scope.tableParams.page(1);
					$scope.tableParams.reload();
				} else if(data.returnCode == overTimeCode) {
					$state.go('login');
				}
			});
		}
	});

	$scope.ok = function() {

		if(actionType == 'delete' || actionType == 'batchDelete') {
			var postBody = [];

			if(actionType == 'batchDelete') {
				angular.forEach($scope.selected, function(data, index, array) {
					if(data == true) {
						postBody.push({
							"id": $scope.tabData[index].id
						});
					}
				});
			} else if(actionType == 'delete') {
				postBody.push({
					"id": datetoBehind.id
				});
			}

			ngResource.Delete('psdon-web/emailController/deleteEmail', postBody).then(function(data) {

				console.log(data.returnCode);
				if(data.returnCode == '1') {
					toastr.success('删除成功');
					$scope.selected = [];
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

	$scope.selected = [];
	$scope.selectAll = function(isSelectAll) {
		for(var i = 0; i < $scope.tabData.length; i++) {
			if(isSelectAll == true) //全选
			{
				$scope.selected[i] = true;

			} else {
				$scope.selected[i] = false;

			}

		}
	};
	$scope.selectIndex = function(index) {
		console.log($scope.selected[index]);

	}
	/*批量删除*/
	$scope.batchDelete = function() {
		actionType = 'batchDelete';

		if($scope.selected.length > 0) {
			$scope.dialogTitle = "提示";
			$scope.dialogMessage = "确定批量删除该任务管理?";
			ngDialog.open({
				scope: $scope,
				width: 400,
				template: 'app/pages/common/warning.html'
			});

		} else {
			toastr.success('请选择删除数据');
		}

	};
	/*删除部门*/
	$scope.deleteTable = function(item) {

		datetoBehind = item;

		actionType = "delete";
		$scope.dialogTitle = "提示";
		$scope.dialogMessage = "确定删除该任务管理?";
		ngDialog.open({
			scope: $scope,
			width: 400,
			template: 'app/pages/common/warning.html'
		});
	};

	$scope.editTable = function(item) {

		$scope.dialogTitle = "编辑";
		$scope.datetoBehind = item;

		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/operationCenter/operManage/editTimer.html',
			controller: 'editTimerCtrl'
		});
	};

});