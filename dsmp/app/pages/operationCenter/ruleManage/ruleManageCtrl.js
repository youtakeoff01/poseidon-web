'use strict';
App.controller('ruleManageCtrl', function($filter,$state, $scope, NgTableParams, ngDialog, ngResource, toastr, $rootScope) {
	var dele = {};  //用于删除存放参数
	// 获取所有数据
	var param = {}; // 获取所有数据参数
	$scope.tableParams = new NgTableParams({
		page: 1,
		count: 10,
		sorting: {}
	}, {
		counts: [],
		getData: function($defer, params) {
			param.startPage = params.page();
			param.count = params.count();
			ngResource.Query('psdon-web/paramSubmitController/listScriptRuleInfo', param).then(function(data) {
				if(data.returnCode == '1') {
					$scope.ruleData = data.returnObject.lists;
					params.total(data.returnObject.countAll);
					$defer.resolve($scope.ruleData);
				} else if(data.returnCode == overTimeCode) {
					$state.go('login');
				} 
			});
		}
	});

	// 查询规则
	$scope.dataSearch = function(key){
		param.scriptTitle = key;
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
	}
    // 新增规则
    $scope.addRuleManage = function() {
		$scope.dialogTitle = "新增";
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/operationCenter/ruleManage/addRuleMana.html',
			controller: 'addRuleManaCtrl'
		});
	};

	// 删除规则
	var actionType;  // 用于判断删除类型
		// 单个删除
	$scope.deleteRule = function(item) {
		dele = {};
		dele.id = item.id;
		actionType = "delete";
		$scope.dialogTitle = "提示";
		$scope.dialogMessage = "确定删除该数据源?";
		ngDialog.open({
			scope: $scope,
			width: 400,
			template: 'app/pages/common/warning.html'
		});
	};
		// 批量删除
			//全选
	$scope.selected = [];
	$scope.selectAll = function(isSelectAll) {
		for(var i = 0; i < $scope.ruleData.length; i++) {
			if(isSelectAll == true) //全选
			{
				$scope.selected[$scope.ruleData[i].id] = true;
			} else {
				$scope.selected[$scope.ruleData[i].id] = false;
			}
		}
	};
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
	// 删除函数
	$scope.ok = function() {
		if(actionType == 'delete' || actionType == 'batchDelete') {
			var postBody = [];
			if(actionType == 'batchDelete') {
				angular.forEach($scope.selected, function(data, index, array) {
					dele = {};
					if(data == true) {
						dele.id = index;
						postBody.push(dele);
					}
				});
			} else if(actionType == 'delete') {
				postBody.push(dele);
			}
			ngResource.Delete('psdon-web/paramSubmitController/deleteScriptInfo', postBody).then(function(data) {
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
	}

	// 编辑规则
	$scope.editRule = function(item){
		$scope.dialogTitle = "编辑";
		$scope.RuleData = angular.copy(item);
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/operationCenter/ruleManage/editRuleMana.html',
			controller: 'editRuleManaCtrl'
		});
	}	
});