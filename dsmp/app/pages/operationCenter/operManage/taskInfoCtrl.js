'use strict';
/*
 * auth 杨丽娟
 * date 2017-12-07
 * description 任务信息
 */
App.controller('taskInfoCtrl', function($state, $scope, $rootScope, NgTableParams, ngDialog, ngResource, toastr) {
	$scope.tabData = [{}];
	var param = {
		latestTaskEntity: {},
	};  // 查询参数
	var actionType;   // 删除标志
	var oneDelItem;   // 单个删除数据存储

	//添加筛选条件
		//  按任务名筛选
	$scope.dataNameSearch = function() {
		param.latestTaskEntity.taskName = $scope.searchNameKey,
		param.latestTaskEntity.taskType = $scope.searchtypeKey
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
	}
	// 按任务类型筛选
	$scope.dataTypeSearch = function() {
		param.latestTaskEntity.taskName = $scope.searchNameKey,
		param.latestTaskEntity.taskType = $scope.searchtypeKey
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
	}

	$scope.tableParams = new NgTableParams({
		page: 1,
		count: 10,
		sorting: {}
	}, {
		counts: [],
		// total: tableData.length,
		getData: function($defer, params) {
			param.startPage = params.page();
			param.count = params.count();
			ngResource.Query('psdon-web/tasksubmitcontroller/listJarTasks', param).then(function(data) {
				if(data.returnCode == '1') {

					$scope.taskData = data.returnObject.lists;
					params.total(data.returnObject.countAll);
					$defer.resolve($scope.tabData);
				} else if(data.returnCode == overTimeCode) {
					$state.go('login');
				}
			});
		}
	});



	// 设置定时器
	$scope.timerSet = function(item){
		$scope.emailInfo='1';
		$scope.dialogTitle = "任务调度";
		$scope.datetoBehind = angular.copy(item);
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/operationCenter/operManage/editTimer.html',
			controller: 'editTimerCtrl'
		});
	}

	// 全选
	$scope.selected = [];
	$scope.selectAll = function(isSelectAll) {
		for(var i = 0; i < $scope.taskData.length; i++) {
			if(isSelectAll == true) //全选
			{
				$scope.selected[$scope.taskData[i].id] = true;
			} else {
				$scope.selected[$scope.taskData[i].id] = false;
			}
		}
	};

	$scope.selectIndex = function(index) {
		console.log($scope.selected[index]);
	}

	// 单个删除
	$scope.deleteTask = function(index) {
		actionType = 'delete';
		$scope.dialogTitle = "提示";
		oneDelItem = index;
		$scope.dialogMessage = "确定批量该提交?";
		ngDialog.open({
			scope: $scope,
			width: 400,
			template: 'app/pages/common/warning.html'
		});
	}
	
	// 批量删除确定弹框
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
				$scope.dialogMessage = "确定批量删除提交任务?";
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

	// 删除函数
	$scope.ok = function(){
		var postBody = [];
		if(actionType == 'delete'){
			postBody = [{
				"latestTaskEntity": {
					"id": oneDelItem.id,
					"taskName": oneDelItem.taskName,
					"taskType": oneDelItem.taskType
				},
				"taskAttributeEntity": {
					"id": oneDelItem.taskAttrId
				}
			}];
		}else if(actionType = 'batchDelete'){
			angular.forEach($scope.selected, function(data, index, array) {
				if(data == true) {
					// 查询该id对应的信息
					for(var item in $scope.taskData){
						if($scope.taskData[item].id == index){
							postBody.push({
								"latestTaskEntity": {
									"id": index,
									"taskName": $scope.taskData[item].taskName,
									"taskType": $scope.taskData[item].taskType
								},
								"taskAttributeEntity": {
									"id": $scope.taskData[item].taskAttrId
								}
							})
						}
					}
				}
			});
		}
		ngResource.Delete('psdon-web/tasksubmitcontroller/deleteJarTasks', postBody).then(function(data) {
			if(data.returnCode == '1') {
				toastr.success('删除成功');
				$scope.selected = [];
				$scope.tableParams.page(1);
				$scope.tableParams.reload();
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			} else {
				toastr.error('删除失败');
			}
		});
		ngDialog.closeAll();
	}

	// SQOOP 自定义参数配置
	$scope.paraConfig = function(item){
		$scope.setJarParam = angular.copy(item);	
		$scope.dialogTitle = "自定义参数配置";
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/operationCenter/operManage/cusParaConfig.html',
			controller: 'sqoopCustomCtrl'
		});
	}

	// 编辑任务配置参数
	$scope.editTask=function(item){
		$scope.editJarTask = angular.copy(item);	
		$scope.dialogTitle = "任务配置编辑";
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/operationCenter/operManage/editTaskInfo.html',
			controller: 'editJarConfigCtrl'
		});
	}
	//执行任务
	$scope.exectueTask = function(index) {
		var param = {
			'taskName': index.taskName,
			'taskType': index.taskType
		};
		ngResource.Query('psdon-web/tasksubmitcontroller/execJartasks', param).then(function(data) {
			if(data.returnCode == '1') {
				toastr.success("执行成功!");
			} else if(data.returnCode == '0') {
				toastr.error(data.returnMessage);
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}
		});
	}
	

	var destroyData = $rootScope.$on('TaskInfo', function() {
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
	})

	$scope.$on('$destroy', function() { //controller回收资源时执行
		destroyData(); //回收广播
	});

});