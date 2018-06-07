'use strict';
/*
 * auth 杨丽娟
 * date 2017-08-10
 * description 同步任务
 */
App.controller('syncTaskCtrl', function($state, $scope, $rootScope, NgTableParams, ngDialog, ngResource, toastr) {
	var actionType = [];
	$scope.tabData = [{}];
	var tableData = [];
	var datetoBehind = [];
	$scope.tabInfo = {};

	$scope.exectueShow = 1;


	//执行
	$scope.exectueTable = function(item) {
		/* 是否分区  分区加弹框   不分区直接执行 */
		$scope.parData = angular.copy(item);
		if(item.partition){
			$scope.dialogTitle = "分区表时间配置";
			ngDialog.open({
				scope: $scope,
				width: 600,
				template: 'app/pages/operationCenter/operManage/partitionTime.html',
				controller: 'parTimerCtrl'
			});
		}else {
			var param = {
				'id': item.id
			};
			ngResource.Query('psdon-web/TaskController/executeTask', param).then(function(data) {
				$scope.exectueShow = 1;
				if(data.returnCode == '1') {
					toastr.success(data.returnMessage);
				} else if(data.returnCode == '0') {
					toastr.error(data.returnMessage);
				} else if(data.returnCode == overTimeCode) {
					$state.go('login');
				}
			}); 
		}
	}

	//添加筛选条件
	var searchName = "";
	$scope.dataSearch = function() {
		searchName = $scope.searchKey;
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
				'taskName': $scope.searchKey,
				'taskType': 0
			};
			ngResource.Query('psdon-web/TaskController/selectList', param).then(function(data) {
				if(data.returnCode == '1') {
					$scope.tabData = data.returnObject.list;
					params.total(data.returnObject.total);
					$defer.resolve($scope.tabData);
				} else if(data.returnCode == overTimeCode) {
					$state.go('login');
				}
			});
		}
	});

	$scope.ok = function() {

		if(actionType == 'delete' || actionType == 'batchDelete') {
			var postBody = [];
			// console.log($scope.taskSelected);
			if(actionType == 'batchDelete') {
				angular.forEach($scope.taskSelected, function(data, index, array) {
					if(data == true) {
						postBody.push({
							"id": index,
						});
					}
				});
			} else if(actionType == 'delete') {
				postBody.push({
					"id": datetoBehind.id
				});
			}
			ngResource.Delete('psdon-web/TaskController/deleteTask', postBody).then(function(data) {
				if(data.returnCode == '1') {
					toastr.success('删除成功');
					$scope.taskSelected = [];
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

	$scope.taskSelected = [];
	$scope.selectAll = function(isSelectAll) {
		for(var i = 0; i < $scope.tabData.length; i++) {
			if(isSelectAll == true) //全选
			{
				$scope.taskSelected[$scope.tabData[i].id] = true;

			} else {
				$scope.taskSelected[$scope.tabData[i].id] = false;

			}

		}
	};
	$scope.selectIndex = function(index) {
		console.log($scope.taskSelected[index]);

	}
	/*批量删除*/
	$scope.batchDelete = function() {
		actionType = 'batchDelete';
		var flag = false;
		if($scope.taskSelected.length > 0) {
			// 判断数据是否选择删除数据
			for(var i = 0; i < $scope.taskSelected.length; i++) {
				if($scope.taskSelected[i] == true) {
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
	$scope.deleteTable = function(item) {

		datetoBehind = item;

		actionType = "delete";
		$scope.dialogTitle = "提示";
		$scope.dialogMessage = "确定删除该同步任务?";
		ngDialog.open({
			scope: $scope,
			width: 400,
			template: 'app/pages/common/warning.html'
		});
	};

	$scope.editTable = function(item) {
		$scope.emailInfo='1';
		$scope.dialogTitle = "编辑";
		$scope.datetoBehind = item;
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/operationCenter/operManage/editTimer.html',
			controller: 'editTimerCtrl'
		});
	};

	var destroyData = $rootScope.$on('Sync', function() {
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
	})
	$scope.$on('$destroy', function() { //controller回收资源时执行
		destroyData(); //回收广播
	});

});