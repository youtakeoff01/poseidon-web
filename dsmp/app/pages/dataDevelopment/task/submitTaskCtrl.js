'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-23
 * description 数据开发-提交任务
 */
App.controller('submitTaskCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
	var datetoBehind;
	var actionType;   // 删除标志
	$scope.selected = [];
	//新建
	$scope.addTask = function() {
		$scope.dialogTitle = "上传jar文件";
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/dataDevelopment/task/addTask.html',
			controller: 'addTaskCtrl'
		});
	}

	//配置任务属性
	$scope.editTask=function(item){
		$scope.taskRow= item;
		$scope.dialogTitle = "配置任务属性";
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/dataDevelopment/task/editTask.html',
			controller: 'editTaskCtrl'
		});
	}

	$scope.tableParams = new NgTableParams({
		page: 1,
		count: 10,
		sorting: {}
	}, {
		counts: [],
		// total: tableData.length,  // 当tableDte为静态数据时使用
		getData: function($defer, params) {
			var param = {
				'startPage': params.page(),
				'count': params.count()
			}
			ngResource.Query('psdon-web/tasksubmitcontroller/listTaskJars', param).then(function(data) {
				if(data.returnCode == '1') {
					$scope.taskData=data.returnObject.lists;
					params.total(data.returnObject.countAll);
					$defer.resolve($scope.taskData);
				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
					$state.go('login');
				}
			});
		}
	});
	

	// 单个删除
	$scope.deleteTask = function(item) {
		actionType = 'delete';
		datetoBehind = angular.copy(item);
		$scope.dialogTitle = "提示";
		$scope.dialogMessage = "确定删除该数据源?";
		ngDialog.open({
			scope: $scope,
			width: 400,
			template: 'app/pages/common/warning.html'
		});
	};

	// 批量删除
	$scope.batchDelete = function(){
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
	}

	/* 确认删除 */
	$scope.ok = function() {
		var postBody = [];
		if(actionType == 'delete'){
			postBody =[ 
				{
					"jarInfoEntity": {
						"id": datetoBehind.id,
						"jarName": datetoBehind.jarName,
						"jarPath": datetoBehind.jarPath
					}
				}
			]
		}else if(actionType = 'batchDelete'){
			angular.forEach($scope.selected, function(data, index, array){
				if(data == true){
					// 查询该id对应的信息
					for(var item in $scope.taskData){
						if($scope.taskData[item].id == index){
							postBody.push({
								"jarInfoEntity": {
									"id": index,
									"jarName": $scope.taskData[item].jarName,
									"jarPath": $scope.taskData[item].jarPath
								}
							})
						}
					}
				}
			})
		}
		$scope.selected = [];
		ngResource.Delete('psdon-web/tasksubmitcontroller/deleteTaskJars', postBody).then(function(data) {
			if(data.returnCode == '1') {
				var returnData = angular.copy(data.returnObject);
				var content;
				for(var item in returnData){
					if(returnData[item].returnCode == '999999'){
						$scope.dialogTitle = "提示";
						content = item+'已创建任务，不能删除';
						toastr.error(content);
					}else if(returnData[item].returnCode == sucessCode){
						toastr.success(item+'删除成功');
					} 
				}
				$scope.selected = [];
			} else if(data.returnCode == overTimeCode) {
				ngDialog.closeAll();
				$state.go('login');
			} else if(data.returnCode == '0'){
				toastr.error(data.returnMessage);
			}
			ngDialog.closeAll();
			$scope.tableParams.page(1);
			$scope.tableParams.reload();
		});
	};

	// 全选
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

});