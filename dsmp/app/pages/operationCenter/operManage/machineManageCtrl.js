'use strict';
/*
 * auth 杨丽娟
 * date 2017-08-10
 * description 机器学习任务
 */
App.controller('machineManageCtrl', function($state, $scope, $rootScope, NgTableParams, ngDialog, ngResource, toastr) {
	var actionType = [];
	$scope.tabData = [{}];
	var tableData = [];
	var datetoBehind = [];
	$scope.tabInfo = {};
	$scope.execteInfo = [];

	$scope.stateData = [{
		id: '1',
		name: '数据使用率'
	}, {
		id: '2',
		name: '集群状态'
	}];
	$scope.getSelectState = function() {
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
	}
	
	// 点击跳转到历史任务
	$rootScope.goHistoryPage = function(name, key, item) {
		var user = new Object({});
		user.name = name;
		user.keyId = key;
		user.active = true;
		if(user.keyId == 'console') {
			user.tabUrl = 'app/pages/console/opmaintEchart.html';
		} else if(user.keyId == 'consolelist') {
			user.tabUrl = 'app/pages/console/opmaintList.html';
		} else if(user.keyId == 'source') {
			user.tabUrl = 'app/pages/dataIntegration/source/source.html';
		} else if(user.keyId == 'sync') {
			user.tabUrl = 'app/pages/dataIntegration/sync/sync.html';
		} else if(user.keyId == 'permission') {
			user.tabUrl = 'app/pages/dataManagement/permission/permissionQuery.html';
		} else if(user.keyId == 'table') {
			user.tabUrl = 'app/pages/dataManagement/table/table.html';
		} else if(user.keyId == 'log') {
			user.tabUrl = 'app/pages/platformManage/log/log.html';
		} else if(user.keyId == 'sysSet') {
			user.tabUrl = 'app/pages/platformManage/sysSet/sysSet.html';
		} else if(user.keyId == 'userGroup') {
			user.tabUrl = 'app/pages/platformManage/userGroup/userGroup.html';
		} else if(user.keyId == 'userManage') {
			user.tabUrl = 'app/pages/platformManage/userManage/userManage.html';
		} else if(user.keyId == 'ditch') {
			user.tabUrl = 'app/pages/operationCenter/ditch/ditchWarn.html';
		} else if(user.keyId == 'custom') {
			user.tabUrl = 'app/pages/operationCenter/custom/customWarn.html';
		} else if(user.keyId == 'operManage') {
			user.tabUrl = 'app/pages/operationCenter/operManage/opmanage.html';
		} else if(user.keyId == 'history') {
			user.tabUrl = 'app/pages/operationCenter/operManage/opmanageHistory.html';
		} else if(user.keyId == 'operCase') {
			user.tabUrl = 'app/pages/operationCenter/operCase/opmaintCase.html';
		} else if(user.keyId == 'machineDetail') {
			user.tabUrl = 'app/pages/operationCenter/operManage/machineDetail.html';
		} else if(user.keyId == 'search') {
			user.tabUrl = 'app/pages/dataDevelopment/search/dataSearch.html';
		} else if(user.keyId == 'learning') {
			user.tabUrl = 'app/pages/machineLearning/machine/machineLearning.html';
		}
		if($rootScope.menuTabs.length != 0) {
			// temp用于判断历史任务是否存在
			var temp = menuTabsList($rootScope.menuTabs, name);
			// 如果不存在则放进tab数组
			if(temp == false) {
				$rootScope.menuTabs.push(user);
			// 如果存在则替换之前的
			} else if(temp = '任务历史') {
				// 查找位置
				var history;
				for(var j = 0; j < $rootScope.menuTabs.length; j++) {
					// 计算出name为历史任务的对象的索引值
					if(temp == $rootScope.menuTabs[j].name) {
						history = j;
						$rootScope.menuTabs[j].active = true;
					} else {
						$rootScope.menuTabs[j].active = false;
					}
				}
				// 替换
				$rootScope.menuTabs.splice(history, 1, user);
			}
		} else {
			$rootScope.menuTabs.push(user);
		}
		// 取标记的值  如果超过显示菜单的最大值将进行割取
		$rootScope.clickIndex++;
		var lengthStr = $rootScope.menuTabs.length;
		
		// 判断tab栏已经存在clickIndex就不加
		for(var i=0; i<$rootScope.menuTabs.length; i++){
			if($rootScope.menuTabs[i].name == name){
				$rootScope.clickIndex--;
				break;
			}
		}
		
		if (lengthStr > $rootScope.menuNum ) {
			//  多于就9项进行截取
			$rootScope.scliceTabs = $rootScope.menuTabs.slice($rootScope.clickIndex-$rootScope.menuNum+1, $rootScope.menuTabs.length);
		} else {
			// 右侧菜单总取9项
			$rootScope.scliceTabs = $rootScope.menuTabs.slice(0, $rootScope.menuNum);
		}

		// 来回切选(点击已经存在的)
		for(var i=0; i<$rootScope.menuTabs.length; i++){
			var exsitTab = false;
			$rootScope.menuTabs[i].active = false;
			if($rootScope.menuTabs[i].name == name){
				// 如果点击的不存在在右侧菜单栏里，则重新截取，0-9的数据
				for(var j=0; j<$rootScope.scliceTabs.length; j++){
					if($rootScope.scliceTabs[j].name == name){
						exsitTab = true;
						break;
					}
				}
				if(exsitTab){
					$rootScope.menuTabs[i].active = true;
				}else{
					$rootScope.scliceTabs = $rootScope.menuTabs.slice(0, $rootScope.menuNum);
					$rootScope.menuTabs[i].active = true;
				}
			}else{

			} 
		}
		
		// 传递参数（一定需要这一句）
		$rootScope.HistoryTypeName = item.taskName;

		// console.log("传入的name=" + $rootScope.HistoryTypeName);
	}
	
	//执行
	$scope.exectueTable = function(item) {
		var param = {
			'id': item.id
		};
		ngResource.Query('psdon-web/TaskController/executeTask', param).then(function(data) {
			if(data.returnCode == '1') {
				toastr.success(data.returnMessage);
			} else if(data.returnCode == '0') {
				toastr.error(data.returnMessage);
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}
		});


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
				'taskType': 2
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

			ngResource.Delete('psdon-web/TaskController/deleteTask', postBody).then(function(data) {

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
				$scope.selected[$scope.tabData[i].id] = true;
			} else {
				$scope.selected[$scope.tabData[i].id] = false;
			}
		}
		console.log($scope.selected)
	};
	$scope.selectIndex = function(index) {
		console.log($scope.selected[index]);
	}
	/*批量删除*/
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
				$scope.dialogMessage = "确定权限批量删除?";
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
		$scope.dialogMessage = "确定删除该机器学习任务?";
		ngDialog.open({
			scope: $scope,
			width: 400,
			template: 'app/pages/common/warning.html'
		});
	};

	// 点击编辑机器学习
	$rootScope.editMachine = function(name, key, item) {
		var user = new Object({});
		user.name = name;
		user.keyId = key;
		user.active = true;
		if(user.keyId == 'console') {
			user.tabUrl = 'app/pages/console/opmaintEchart.html';
		} else if(user.keyId == 'consolelist') {
			user.tabUrl = 'app/pages/console/opmaintList.html';
		} else if(user.keyId == 'source') {
			user.tabUrl = 'app/pages/dataIntegration/source/source.html';
		} else if(user.keyId == 'sync') {
			user.tabUrl = 'app/pages/dataIntegration/sync/sync.html';
		} else if(user.keyId == 'permission') {
			user.tabUrl = 'app/pages/dataManagement/permission/permissionQuery.html';
		} else if(user.keyId == 'table') {
			user.tabUrl = 'app/pages/dataManagement/table/table.html';
		} else if(user.keyId == 'log') {
			user.tabUrl = 'app/pages/platformManage/log/log.html';
		} else if(user.keyId == 'sysSet') {
			user.tabUrl = 'app/pages/platformManage/sysSet/sysSet.html';
		} else if(user.keyId == 'userGroup') {
			user.tabUrl = 'app/pages/platformManage/userGroup/userGroup.html';
		} else if(user.keyId == 'userManage') {
			user.tabUrl = 'app/pages/platformManage/userManage/userManage.html';
		} else if(user.keyId == 'ditch') {
			user.tabUrl = 'app/pages/operationCenter/ditch/ditchWarn.html';
		} else if(user.keyId == 'custom') {
			user.tabUrl = 'app/pages/operationCenter/custom/customWarn.html';
		} else if(user.keyId == 'operManage') {
			user.tabUrl = 'app/pages/operationCenter/operManage/opmanage.html';
		} else if(user.keyId == 'history') {
			user.tabUrl = 'app/pages/operationCenter/operManage/opmanageHistory.html';
		} else if(user.keyId == 'operCase') {
			user.tabUrl = 'app/pages/operationCenter/operCase/opmaintCase.html';
		} else if(user.keyId == 'machineDetail') {
			user.tabUrl = 'app/pages/operationCenter/operManage/machineDetail.html';
		} else if(user.keyId == 'search') {
			user.tabUrl = 'app/pages/dataDevelopment/search/dataSearch.html';
		} else if(user.keyId == 'learning') {
			user.tabUrl = 'app/pages/machineLearning/machine/machineLearning.html';
		}
		// 同理判断机器学习是否存在，不存在加入，存在则替换
		if($rootScope.menuTabs.length != 0) {
			var temp = menuTabsList($rootScope.menuTabs, name);
			if(temp == false) {
				$rootScope.menuTabs.push(user);
			} else if(temp = '机器学习') {
				var foo;
				for(var j = 0; j < $rootScope.menuTabs.length; j++) {
					if(temp == $rootScope.menuTabs[j].name) {
						$rootScope.menuTabs[j].active = true;
						foo = j;
					} else {
						$rootScope.menuTabs[j].active = false;
					}
				}
				// var str = $rootScope.menuTabs.indexOf(user);
				$rootScope.menuTabs.splice(foo, 1, user);
			}
		} else {
			$rootScope.menuTabs.push(user);

		}
		/* 菜单栏修改的增加部分开始 */
		// 取标记的值
		console.log($rootScope.clickIndex);
		// 如果超过显示菜单的最大值将进行割取
		$rootScope.clickIndex++;
		var lengthStr = $rootScope.menuTabs.length;
		
		// 判断tab栏已经存在clickIndex就不加
		for(var i=0; i<$rootScope.menuTabs.length; i++){
			if($rootScope.menuTabs[i].name == name){
				$rootScope.clickIndex--;
				break;
			}
		}
		
		if (lengthStr > $rootScope.menuNum ) {
			//  多于就9项进行截取
			$rootScope.scliceTabs = $rootScope.menuTabs.slice($rootScope.clickIndex-$rootScope.menuNum+1, $rootScope.menuTabs.length);
		} else {
			// 右侧菜单总取9项
			$rootScope.scliceTabs = $rootScope.menuTabs.slice(0, $rootScope.menuNum);
		}

		// 来回切选(点击已经存在的)
		for(var i=0; i<$rootScope.menuTabs.length; i++){
			var exsitTab = false;
			$rootScope.menuTabs[i].active = false;
			if($rootScope.menuTabs[i].name == name){
				// 如果点击的不存在在右侧菜单栏里，则重新截取，0-9的数据
				for(var j=0; j<$rootScope.scliceTabs.length; j++){
					if($rootScope.scliceTabs[j].name == name){
						exsitTab = true;
						break;
					}
				}
				if(exsitTab){
					$rootScope.menuTabs[i].active = true;
				}else{
					$rootScope.scliceTabs = $rootScope.menuTabs.slice(0, $rootScope.menuNum);
					$rootScope.menuTabs[i].active = true;
				}
			}else{

			} 
		}
		/* 菜单栏修改的增加部分结束 */

		// console.log("temp=" + temp);
		$rootScope.machineId = item.id;
		$rootScope.machineName = item.taskName;
		$rootScope.machineAccount=item.createAccount;
		console.log("传入的id=" + $rootScope.machineId);

	};

	//执行
	$scope.goMachinePage = function(row) {

	}
	var destroyData = $rootScope.$on('Machine', function() {
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
		console.log("机器任务"); //接收广播
	})
	$scope.$on('$destroy', function() { //controller回收资源时执行
		destroyData(); //回收广播
	});

});