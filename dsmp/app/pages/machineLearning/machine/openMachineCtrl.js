//'use strict';
/*
 * auth 杨丽娟
 * date 2017-09-27
 * description 选择字段
 */
App.controller('openMachineCtrl', function($rootScope, $state, $scope, ngDialog, ngResource, toastr, NgTableParams) {

	$scope.selected = [];
	$scope.optRightData = [];
	$scope.editCode = 0;

	var tableData = [];
	$scope.query = "";
	$scope.changeQuery = function(name) {
		$scope.query = name;
	}
	//添加筛选条件
	$scope.dataSearch = function() {
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
		console.log("查询=" + $scope.query);
	}
	//表格
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
				"nodeId": $scope.nodeId,
				"json": $scope.jsonData,
				"optsEntity": $scope.allOptionData,
				"query": $scope.query
			};
			ngResource.Query('psdon-web/comController/getPreOpts', param).then(function(data) {
				if(data.returnCode == '1') {
					$scope.optsData = data.returnObject;
					$scope.changeData();

					params.total(data.returnObject.countAll);
					$defer.resolve($scope.queryData);
				} else {

				}
			});
		}
	});

	//列表
	$scope.listClick = function() {
		console.log("列表" + $scope.selectString);
		$scope.editCode = 0;
		$scope.changeData();

	}

	//编辑
	$scope.editClick = function() {
		console.log("编辑" + $scope.selectString);
		$scope.editCode = 1;
		$scope.selectString = "";
		for(var j = 0; j < $scope.optRightData.length; j++) {
			if(j != $scope.optRightData.length - 1) {
				$scope.selectString += $scope.optRightData[j].selectV + ',';
			} else {
				$scope.selectString += $scope.optRightData[j].selectV;
			}
		}
		console.log("编辑" + $scope.selectString);

	}
	//changeText
	$scope.changeText = function(name) {
		$scope.selectString = name;
		console.log("改变" + name);
	}

	/*批量删除*/
	$scope.selectAll = function(isSelectAll) {
		for(var i = 0; i < $scope.optsData.length; i++) {
			if(isSelectAll == true) //全选
			{
				$scope.selected[$scope.optsData[i].selectV] = true;
				$scope.optsData[i].optSelected = 1;
			} else {
				$scope.selected[$scope.optsData[i].selectV] = false;
				$scope.optsData[i].optSelected = 0;
			}
		}
		$scope.changeRightData();

	};
	$scope.changeData = function() {
		$scope.optRightData = [];
		if($scope.selectString != '') {
			var arrOpt = $scope.selectString.split(',');
			for(var i = 0; i < $scope.optsData.length; i++) {
				for(var j = 0; j < arrOpt.length; j++) {
					if($scope.optsData[i].selectV == arrOpt[j]) {
						$scope.selected[$scope.optsData[i].selectV] = true;
						$scope.optsData[i].optSelected = 1;
						arrOpt.splice(j, 1);
					}
				}
			}

			console.log("获取数据=" + arrOpt.toString());
			var lengths = $scope.optsData.length;
			if(arrOpt.length != 0) {
				for(var j = 0; j < arrOpt.length; j++) {
					$scope.optsData.push({
						"selectV": arrOpt[j],
						"optSelected": 3
					});
					$scope.selected[$scope.optsData[lengths + j].selectV] = false;
				}
			}
		}

		for(var i = 0; i < $scope.optsData.length; i++) {
			if($scope.optsData[i].optSelected == 1 || $scope.optsData[i].optSelected == 3) //全选
			{
				$scope.optRightData.push($scope.optsData[i]);
			}
		}
		$scope.selectString = "";
		for(var j = 0; j < $scope.optRightData.length; j++) {
			if(j != $scope.optRightData.length - 1) {
				$scope.selectString += $scope.optRightData[j].selectV + ',';
			} else {
				$scope.selectString += $scope.optRightData[j].selectV;
			}
		}
	}
	$scope.changeRightData = function() {
		$scope.optRightData = [];

		for(var i = 0; i < $scope.optsData.length; i++) {
			if($scope.optsData[i].optSelected == 1 || $scope.optsData[i].optSelected == 3) //全选
			{
				$scope.optRightData.push($scope.optsData[i]);
			}
		}
		$scope.selectString = "";
		for(var j = 0; j < $scope.optRightData.length; j++) {
			if(j != $scope.optRightData.length - 1) {
				$scope.selectString += $scope.optRightData[j].selectV + ',';
			} else {
				$scope.selectString += $scope.optRightData[j].selectV;
			}
		}

	}

	$scope.changSelect = function(index) {

		if($scope.selected[$scope.optsData[index].selectV] == true) {
			$scope.optsData[index].optSelected = 1;
		} else {
			$scope.optsData[index].optSelected = 0;
		}
		$scope.changeRightData();
		console.log("index=" + index);

	}
	//右边的删除
	//全部删除
	$scope.selectRightAll = function(isSelectRightAll) {
		console.log('用户删除1=', document.getElementById("checkAlluserManage").checked);
		for(var i = 0; i < $scope.optsData.length; i++) {
			document.getElementById("checkAlluserManage").checked = false;
			$scope.optRightData = [];
			$scope.selected[$scope.optsData[i].selectV] = false;
			$scope.optsData[i].optSelected = 0;
		}

	};
	//单个删除
	$scope.deleteSelect = function(index) {
		var temp = $scope.optRightData[index];

		for(var j = 0; j < $scope.optsData.length; j++) {
			if(temp.selectV == $scope.optsData[j].selectV) {
				document.getElementById("checkAlluserManage").checked = false;
				$scope.selected[$scope.optsData[j].selectV] = false;
				if(temp.optSelected = 3) {
					$scope.optsData[j].optSelected = 2;
				} else {
					$scope.optsData[j].optSelected = 0;
					
				}

				
			}
		}


		$scope.changeRightData();
	}
	$scope.ok = function() {
		$scope.selectString = "";
		for(var j = 0; j < $scope.optRightData.length; j++) {
			if(j != $scope.optRightData.length - 1) {
				$scope.selectString += $scope.optRightData[j].selectV + ',';
			} else {
				$scope.selectString += $scope.optRightData[j].selectV;
			}
		}
		var strLenght = $scope.selectString.split(",").length;
		for(var j = 0; j < $scope.allOptionData.length; j++) {
			if($scope.allOptionData[j].comNum == $scope.nodeId) {
				for(var i = 0; i < $scope.allOptionData[j].list.length; i++) {
					if($scope.allOptionData[j].list[i].optName == $scope.optName) {
						$scope.allOptionData[j].list[i].optDefault = $scope.selectString;
						$scope.allOptionData[j].list[i].optPopupNum = strLenght;
					}
				}
			}
		}

		console.log("组件属性=" + angular.toJson($scope.allOptionData));
		ngDialog.closeAll();

	}
	$scope.reSet = function() {
		ngDialog.closeAll();
	}

});