'use strict';
/*
 * auth yanglijuan
 * date 2017-06-14
 * description 数据历史
 */
App.controller('dataHistoryCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
	$scope.historyData = [{}];
	var tableData = [];


	
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
				'jobName': searchName
			};
			ngResource.Query('psdon-web/dataSyncHistoryController/listDataSyncHistory', param).then(function(data) {
				if(data.returnCode == '1') {
					$scope.historyData = data.returnObject.dataSyncHistoryEntitys;
					params.total(data.returnObject.countAll);
					$defer.resolve($scope.historyData);
				} else if(data.returnCode == overTimeCode) {
					$state.go('login');
				}
			});
		}
	});

	//全选
	$scope.selected = [];
	$scope.selectAll = function(isSelectAll) {
		for(var i = 0; i < $scope.historyData.length; i++) {
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
	$scope.batchDelete = function() {
		actionType = 'batchDelete';

		if($scope.selected.length > 0) {
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

	};
	/*删除部门*/
	$scope.deleteTable = function(item) {
		datetoBehind = item;
		actionType = "delete";
		$scope.dialogTitle = "提示";
		$scope.dialogMessage = "确定删除该数据?";
		ngDialog.open({
			scope: $scope,
			width: 400,
			template: 'app/pages/common/warning.html'
		});
	};

	$scope.editTable = function(item) {
		$scope.dialogTitle = "编辑";
		$scope.datetoBehind = item;
		console.log("编辑数据同步历史");
	};

	/*确认修改*/
	$scope.ok = function() {

		if(actionType == 'delete' || actionType == 'batchDelete') {
			var postBody = [];
			if(actionType == 'batchDelete') {
				angular.forEach($scope.selected, function(data, index, array) {
					if(data == true) {
						postBody.push($scope.historyData[index].id);
					}
				});
			} else if(actionType == 'delete') {
				postBody.push(datetoBehind.id);
			}

			ngResource.Delete('psdon-web/dbSrcController/deleteDBSrcsById', postBody).then(function(data) {
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
});