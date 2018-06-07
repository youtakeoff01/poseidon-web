'use strict';
/*
 * auth yanglijuan
 * date 2017-05-25
 * description 我的数据-数据源管理
 */
App.controller('sourceCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
	$scope.queryData = [{}];
	var tableData = [];
	var actionType = [];
	var datetoBehind = [];
	//	
	$scope.editCode = "";

	//添加筛选条件
	var searchName = "";
	$scope.dataSearch = function() {
		searchName = $scope.searchKey;
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
			var param = {
				'startPage': params.page(),
				'count': params.count(),
				'srcName': searchName
			};
			ngResource.Query('psdon-web/dbSrcController/listDBSrcs', param).then(function(data) {
				if(data.returnCode == '1') {
					$scope.queryData = data.returnObject.dbsrcvos;
					params.total(data.returnObject.counts);
					$defer.resolve($scope.queryData);
				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
					$state.go('login');
				}
			});
		}
	});

	//全选
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
	$scope.selectIndex = function(index) {
		console.log($scope.selected[index]);
	}

	// 批量删除
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

	// 单个删除
	$scope.deleteTable = function(item) {
		datetoBehind = item;
		actionType = "delete";
		$scope.dialogTitle = "提示";
		$scope.dialogMessage = "确定删除该数据源?";
		ngDialog.open({
			scope: $scope,
			width: 400,
			template: 'app/pages/common/warning.html'
		});
	};

	/*添加数据源*/
	$scope.addSource = function() {
		$scope.dialogTitle = "新增";

		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/dataIntegration/source/addSource.html',
			controller: 'addSourceCtrl'

		});
	};

	// 编辑
	$scope.editTable = function(item) {
		$scope.dialogTitle = "编辑";
		$scope.datetoBehind = item;
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/dataIntegration/source/editSource.html',
			controller: 'editSourceCtrl'
		});
	};

	/*确认删除*/
	$scope.ok = function() {

		if(actionType == 'delete' || actionType == 'batchDelete') {
			var postBody = [];
			if(actionType == 'batchDelete') {
				angular.forEach($scope.selected, function(data, index, array) {
					if(data == true) {
						/* postBody.push($scope.queryData[index].id); */
						postBody.push(index);
					}
				});
			} else if(actionType == 'delete') {
				postBody.push(datetoBehind.id);
			}

			ngResource.Delete('psdon-web/dbSrcController/deleteDBSrcsById', postBody).then(function(data) {
				if(data.returnCode == '1') {
					toastr.success('删除成功');
					$scope.selected = [];
				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
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
});