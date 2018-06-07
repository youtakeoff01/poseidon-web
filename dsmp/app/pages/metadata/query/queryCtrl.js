'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-23
 * description 元数据-表管理
 */
App.controller('queryCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
	var actionType = "";
	$scope.queryData = [{}];
	var tableData = [];
	var searchTypeData = "";

	
	//下拉框数据
	//对象
	$scope.queryInfo = {};
	$scope.selectData = [{
		id: '1',
		name: 'hive_table'
	}, {
		id: '2',
		name: 'hdfs_path'
	}];
	$scope.queryInfo = $scope.selectData[0];
	$scope.selectQuery = function() {
		searchTypeData = $scope.queryInfo.name;
		$scope.tableParams.reload();
		console.log(searchTypeData);
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
				'searchType': searchTypeData
			};
			ngResource.Query('psdon-web/metaDataController/listHiveHDFSMetaData', param).then(function(data) {
				if(data.returnCode == '1') {
					$scope.queryData = data.returnObject.hiveMetaDescs;
					params.total(data.returnObject.countAll);
					$defer.resolve($scope.queryData);
				} else if(data.returnCode == overTimeCode) {
					$state.go('login');
				}
			});
		}
	});
	/*删除数据*/
	$scope.deleteQuery = function(item) {
		$scope.dialogTitle = "提示";
		$scope.dialogMessage = "确定删除该数据?";
		ngDialog.open({
			scope: $scope,
			width: 400,
			template: 'app/pages/common/warning.html'
		});
	};
	/*编辑数据*/
	$scope.editQuery = function() {
		$scope.dialogTitle = "编辑";
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/metadata/query/editQuery.html'
		});
	};
});