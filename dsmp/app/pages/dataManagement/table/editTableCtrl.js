'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-23
 * description 表管理-修改
 */
App.controller('editTableCtrl', function($state,$scope, NgTableParams,ngDialog, ngResource, toastr) {
	$scope.editHiveFields = [];
	$scope.datetoBehind = {};
		// 表字段类型
	$scope.tabFieldType = ['INT','BIGINT','STRING','BOOLEAN','FLOAT','DOUBLE','TINYINT','SMALLINT',,'CHAR','VARCHAR','DATE','BINARY','TIMESTAMP','DECIMAL'];
		// 获取表字段信息函数
	function getTabDetail(tabName){
		var param = {};  
		param.dbName = $scope.editDbName;
		param.tableName = tabName;
		ngResource.Add('psdon-web/hiveTable/selectFields',{}, param).then(function(data) {
			if(data.returnCode){
				// 查询失败
				if(data.returnCode == overTimeCode){
					setTimeout(function(){
						ngDialog.closeAll();
					},500)
					setTimeout(function(){
						$state.go('login');
					},1000)
				}
			}else{
				// 默认获取之前所有字段
				$scope.editHiveFields = angular.copy(data.data);
				for(var i in $scope.editHiveFields){
					$scope.editHiveFields[i].add = true;
				}
			}
		}); 
	}
		// 如果表名为‘*’，获取所有表名函数
	function getHiveName(name){
		var dataParam = {
			dbName: name,
		}
		ngResource.Query('psdon-web/hiveTable/select',dataParam).then(function(data){
			if(angular.isUndefined(data.error)){
				$scope.tableNames = angular.copy(data.data);
				$scope.datetoBehind.tableName = $scope.tableNames[0];
				if(data.returnCode == overTimeCode){
					setTimeout(function(){
						ngDialog.closeAll();
					},500)
					setTimeout(function(){
						$state.go('login');
					},1000)
				}
			} else{
				// 
			}
		})
	}

	if($scope.editTableInfo.table != '*'){
		// 默认获取表名
		$scope.datetoBehind.tableName = $scope.editTableInfo.table;
		getTabDetail($scope.editTableInfo.table);
	}else{
		getHiveName($scope.editDbName);
	}

	// 改变表获取表字段
	$scope.changeTabName = function(name){
		getTabDetail(name);
	}

	// 表字段信息增加（只能增加）
	$scope.removeItem = function() {
		var index = $scope.editHiveFields.indexOf(this.fieldName);
		$scope.editHiveFields.splice(index, 1);
	};
	function createRandomItem() {
		return {
			fieldName: "",
			fieldType: $scope.tabFieldType[0],
            flag: 1,
			fieldDescribe: "",
			add: false,
		};
	}
	$scope.addProRow = function() {
		$scope.editHiveFields.push(createRandomItem());
	};

	$scope.ok = function() {
		var flag = true;
		for(var i in $scope.editHiveFields){
			if($scope.editHiveFields[i].fieldName == ''){
				flag = false;
				break;
			}
		}
		if(flag){
			var editBody = {};
			var editHiveFields = [];  // 除去原有的字段，只传新增字段
			for(var item in $scope.editHiveFields){
				if($scope.editHiveFields[item].add == false){
					editHiveFields.push($scope.editHiveFields[item]);
				}
			}
			editBody = {
				dbName: $scope.editDbName,
				tabelName: $scope.datetoBehind.tableName,
				metaTableField: editHiveFields,
			};
			ngResource.Update('psdon-web/hiveTable/update', {}, editBody).then(function(data) {
				if(data.returnCode == '000000') {
					$scope.tableParams.reload();
					toastr.success('修改成功');
				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
					$state.go('login');
				} else if(data.returnCode == '999999'){
					toastr.error(data.returnMessage);
				}
				ngDialog.closeAll();
				$scope.tableParams.page(1);
				$scope.tableParams.reload();
			}); 
		}else{
			toastr.error('请填写字段名');
		}
	}
});