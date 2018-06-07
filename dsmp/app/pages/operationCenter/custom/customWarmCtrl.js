'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-23
 * description 自定义通知
 */
App.controller('customWarmCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
	var actionType = [];
	$scope.tabData = [];
	var tableData = [];
	var datetoBehind = [];
	$scope.tabInfo = {};

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
				'ruleName': searchName
			};
			ngResource.Query('psdon-web/noticeRuleController/listNoticeRule', param).then(function(data) {
				if(data.returnCode == '1') {
					$scope.tabData = data.returnObject.notices;
					params.total(data.returnObject.countAll);
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
							"id": index,
						});
					}
				});
			} else if(actionType == 'delete') {
				postBody.push({
					"id": datetoBehind.id
				});
			}

			ngResource.Delete('psdon-web/noticeRuleController/deleteNoticeRule', postBody).then(function(data) {
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
			for(var i=0; i<$scope.selected.length; i++){
				if($scope.selected[i] == true){
					flag = true;
					break;
				};
			}	
			if(flag){
				$scope.dialogTitle = "提示";
				$scope.dialogMessage = "确定批量删除该数据源?";
				ngDialog.open({
					scope: $scope,
					width: 400,
					template: 'app/pages/common/warning.html'
				});
			} else{
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
		$scope.dialogMessage = "确定删除该通知渠道?";
		ngDialog.open({
			scope: $scope,
			width: 400,
			template: 'app/pages/common/warning.html'
		});
	};
	/*添加新增数据*/
	$scope.addTable = function() {
		actionType = "add";
		$scope.dialogTitle = "新增";
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/operationCenter/custom/addCustom.html',
			controller: 'addCustomCtrl'
		});
	};

	$scope.editTable = function(item) {
		$scope.datetoBehind = angular.copy(item)
		$scope.dialogTitle = "编辑";
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/operationCenter/custom/editCustom.html',
			controller: 'editCustomCtrl'
		}); 
	};

});