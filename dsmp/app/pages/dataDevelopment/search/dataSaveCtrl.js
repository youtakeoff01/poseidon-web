'use strict';
/*
 * auth 杨丽娟
 * date 2017-08-09
 * description 数据加工-保存
 */
App.controller('dataSaveCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
	$scope.partition = '1';
	$scope.saveData = {
		targetTable: [],
		dataSource: [],
		partitionText: [],
		relyData: []
	};
	$scope.saveData.sqlText = $scope.saveSqlText;
	//任务名称的校验
	$scope.checkName = function(index) {
		if(index) {
			var param = {
				'taskName': index
			};
			ngResource.Query('psdon-web/TaskController/checkTask', param).then(function(data) {
				$scope.taskNameCode = data.returnCode;
				if(data.returnCode == '0') {
					toastr.error("该任务存在,不可以使用");
				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
					$state.go('login');
				}
			})
		} else {

		}
	}

	//任务依赖
	var relyParam = {
		'taskType': 0
	}
	ngResource.Query('psdon-web/TaskController/selects', relyParam).then(function(data) {
		if(data.returnCode == '1') {
			$scope.relyOnData = data.returnObject;
		} else if(data.returnCode == overTimeCode) {
			setTimeout(function(){
				ngDialog.closeAll();
			},500)
			setTimeout(function(){
				$state.go('login');
			},1000)
		}
	});

	//数据源
	ngResource.Query('psdon-web/dataSourceController/getHiveDbNames', '').then(function(data) {
		if(data.returnCode == '1') {
			$scope.dataSourceData = [];
			var dataArr = data.returnObject;
			for(var i = 0; i < dataArr.length; i++) {
				var temp = dataArr[i];
				var user = new Object({});
				user.name = dataArr[i];
				$scope.dataSourceData.push(user);
			}
		} else if(data.returnCode == overTimeCode) {
			setTimeout(function(){
				ngDialog.closeAll();
			},500)
			setTimeout(function(){
				$state.go('login');
			},1000)
		}
	});

	$scope.getTarget = function() {
		$scope.saveData.targetTable = [];
		//目标表
		var params = {
			'dbName': $scope.saveData.dataSource.name
		}
		ngResource.Query('psdon-web/DataQueryController/listHiveTables', params).then(function(data) {
			if(data.returnCode == '1') {
				$scope.targetData = [];
				var dataArr = data.returnObject;
				for(var i = 0; i < dataArr.length; i++) {
					var temp = dataArr[i];
					var user = new Object({});
					user.name = dataArr[i];
					$scope.targetData.push(user);
				}
			} else if(data.returnCode == overTimeCode) {
				ngDialog.closeAll();
				$state.go('login');
			}
		});
	}
	//是否分区
	$scope.changepart = function(index) {
		$scope.partition = index;
	}
	$scope.getPartition = function() {

		//分区字段
		var str = {
			'dbName': $scope.saveData.dataSource.name,
			'tableName': $scope.saveData.targetTable.name
		}
		ngResource.Query('psdon-web/DataQueryController/getTableFields', str).then(function(data) {
			if(data.returnCode == '1') {
				$scope.partitionData = [];
				var dataArr = data.returnObject;
				for(var i = 0; i < dataArr.length; i++) {
					var temp = dataArr[i];
					var user = new Object({});
					user.name = dataArr[i];
					$scope.partitionData.push(user);
				}
				//console.log($scope.targetData);
			} else if(data.returnCode == overTimeCode) {
				ngDialog.closeAll();
				$state.go('login');
			}
		});
	}

	//保存
	$scope.ok = function() {
		var params = "";
		if($scope.taskNameCode == 1) {
			if(angular.isUndefined($scope.saveData.name) || $scope.saveData.name != "") {
				//操作用户的id
				/* if($scope.partition == 0) {
					params = {
						'taskName': $scope.saveData.name,  // 任务名称
						'sqlStc': $scope.saveData.sqlText,  // 	SQL语句
						'sqlType': $scope.sqlType,  // 	sql类型
						'targetDB': $scope.saveData.dataSource.name, // 目标库名
						'targetTable': $scope.saveData.targetTable.name, // 目标表名
						'partition': $scope.saveData.partitionText.name, // 分区
						'dependencies': $scope.saveData.relyData.taskName // 任务依赖任务名称
					}
				} else {
				} */
				params = {
					'taskName': $scope.saveData.name, // 任务名称
					'sqlStc': $scope.saveData.sqlText,
					'sqlType': $scope.sqlType,
					'dependencies': $scope.saveData.relyData.taskName // 任务依赖任务名称
				}
				ngResource.Query('psdon-web/DataQueryController/addTask', params).then(function(data) {
					if(data.returnCode == '1') {
						toastr.success("新增成功！");
						ngDialog.closeAll();
					} else if(data.returnCode == '0') {
						toastr.error(data.returnMessage);
						// ngDialog.closeAll();
					} else if(data.returnCode == overTimeCode) {
						ngDialog.closeAll();
						$state.go('login');
					}
				});
			} else {
				toastr.error("请填写必填项！");
			}
		} else if($scope.taskNameCode == 0) {
			toastr.error("该任务存在,不可以使用");
		} else if(angular.isUndefined($scope.taskNameCode)){
			toastr.error("请填写必填项！");
		}
	}
});