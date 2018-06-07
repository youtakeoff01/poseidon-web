'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-23
 * description 数据开发-数据加工
 */
App.controller('dataSearchCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
	$scope.listSearch = [];
	$scope.DataSearch = [];
	$scope.saveSqlText = "";
	$scope.tabList = ['SPARK', 'HIVE'];
	$scope.sqlType = "";
	$scope.historyData = [{}];

	//标签页切换
	$scope.activeSearch = 0;
	$scope.tabIndex = 0;

	var tableData = [];

	$scope.getViewPortHeight = document.documentElement.clientHeight;
	$scope.leftHeightDiv = {
		"height": $scope.getViewPortHeight - 200,
	};

	ngResource.Query('psdon-web/hiveDataPermission/getHiveDbAndTables', '').then(function(data) {
		if(data.returnCode == '000000') {
			$scope.tablesData = data.returnObject;
		} else if(data.returnCode == overTimeCode) {
			ngDialog.closeAll();
			$state.go('login');
		}
	});

	// 点击获取库名和表名
	var fatherName;
	var checkName = [];
	$scope.sqlTypeText = [];
	$scope.dbclickFatherCopy = function(father) {
		fatherName = father.dbName;
	}
	$scope.dbclickCopy = function(name) {
		if($scope.activeSearch == 0) {
			if($scope.sqlTypeText[0]) {
				$scope.sqlTypeText[0] = $scope.sqlTypeText[0] + fatherName + '.' + name;
			} else {
				$scope.sqlTypeText[0] = fatherName + '.' + name;
			}
		} else if($scope.activeSearch == 1) {
			if($scope.sqlTypeText[1]) {
				$scope.sqlTypeText[1] = $scope.sqlTypeText[1] + fatherName + '.' + name;
			} else {
				$scope.sqlTypeText[1] = fatherName + '.' + name;
			}
		}
		//console.log($scope.sqlTypeText[0]);
	};

	//执行
	$scope.execute = function(row, sqlText) {
		if(sqlText != undefined) {
			var param = {
				'sqlType': row,
				'sqlStc': sqlText
			};
			ngResource.Query('psdon-web/DataQueryController/query', param).then(function(data) {
				if(data.returnCode == '1') {
					$scope.DataSearch = data.returnObject.data;
					$scope.columnData = data.returnObject.column;
				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
					$state.go('login');
				} else if(data.returnCode == '0'){
					toastr.error(data.returnMessage)
				}
			});
			$scope.tabIndex = 1;
		}

	}
	//保存
	$scope.save = function(row, sqlText) {
		$scope.sqlType = row;
		$scope.saveSqlText = sqlText;
		$scope.dialogTitle = "保存";
		ngDialog.open({
			scope: $scope,
			width: 600,
			
			template: 'app/pages/dataDevelopment/search/dataSave.html',
			controller: 'dataSaveCtrl'
		});
	}

	//执行历史
	$scope.tableParams = new NgTableParams({
		page: 1,
		count: 5,
		sorting: {}
	}, {
		counts: [],
		getData: function($defer, params) {
			var param = {
				'startPage': params.page(),
				'count': params.count(),
				'logType': "SQL执行日志"
			};
			ngResource.Query('psdon-web/logController/logSelect', param).then(function(data) {
				if(data.returnCode == '1') {
					$scope.historyData = data.returnObject.lists;
					params.total(data.returnObject.countAll);
					$defer.resolve($scope.historyData);
				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
					$state.go('login');
				}
			});
		}
	});

	//执行历史
	//编辑
	$scope.editHistory = function(row) {
		if(row.logType == 'SPARK') {
			$scope.sqlTypeText[0] = row.logContent;
			//console.log("sqlTypeText[0]=" + $scope.sqlTypeText[0]);
			$scope.activeSearch = 0;
		} else if(row.logType == 'HIVE') {
			$scope.sqlTypeText[1] = row.logContent;
			//console.log("sqlTypeText[1]=" + $scope.sqlTypeText[1]);
			$scope.activeSearch = 1;
		}

	}
	//删除
	$scope.deleteHistory = function(row) {
		var params = [{
			'id': row.id
		}]
		ngResource.Delete('psdon-web/logController/deleteLog', params).then(function(data) {
			if(data.returnCode == '1') {
				toastr.success('删除成功');
				$scope.selected = [];
			} else if(data.returnCode == overTimeCode) {
				ngDialog.closeAll();
				$state.go('login');
			} else {
				toastr.error('删除失败');
			}
			$scope.tableParams.page(1);
			$scope.tableParams.reload();
		});
	}
	//执行
	$scope.exectueHistory = function(row) {
		var params = {
			'sqlType': row.logType,
			'sqlStc': row.logContent
		};
		ngResource.Query('psdon-web/DataQueryController/query', params).then(function(data) {
			if(data.returnCode == '1') {
				$scope.DataSearch = data.returnObject.data;
				$scope.columnData = data.returnObject.column;
			} else if(data.returnCode == overTimeCode) {
				ngDialog.closeAll();
				$state.go('login');
			}
		});
		$scope.tabIndex = 1;
	}

});