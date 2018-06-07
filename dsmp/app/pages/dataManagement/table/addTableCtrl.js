'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-23
 * description 表管理-增加
 */
App.controller('addTableCtrl', function($state, $scope, NgTableParams, ngResource, toastr, ngDialog) {
	$scope.addTabInfo = {};
	$scope.addTabInfo.tabelName = '';
	// $scope.addTabInfo.metaDataType = {};
	$scope.addTabInfo.defaultPar = 0,
	$scope.addTableField = [];
	var searchTypeData = "";
	$scope.externalDis = false; // 外部表目录显示
	$scope.tabFieldType = ['TINYINT','SMALLINT','INT','BIGINT','FLOAT','DOUBLE','BOOLEAN','STRING']
	
	/* 元数据选择目前没有 */
	// hive库名校验
	/* $scope.checkType = function(type) {
		if(type){
			var param = {
				'dataType': type
			}
			ngResource.Query('psdon-web/metaDataController/hiveDataTypeCheck', param).then(function(data) {
				$scope.typeCode = data.returnCode;
				if($scope.typeCode == 0) {
					toastr.error(data.returnMessage);
				}else if($scope.typeCode == 1) {
					toastr.success(data.returnMessage);
				} else if(data.returnCode == overTimeCode) {
					$state.go('login');
				}
			});
		}
	} */

	//删除表字段
	$scope.removeItem = function() {
		var index = $scope.addTableField.indexOf(this.fieldName);
		$scope.addTableField.splice(index, 1);
	};

	function createRandomItem() {
		return {
			fieldName: "",
			fieldType: $scope.tabFieldType[0],
			flag: 1,
			fieldDescribe: ""
		};
	}

	// 新增表字段
	$scope.addProRow = function() {
		$scope.addTableField.push(createRandomItem());
	};

	// 是否默认分区
	$scope.rowFlag = function(flag){
		$scope.defaultPar = false; 
		for(var i=0 ; i<$scope.addTableField.length; i++){
			if($scope.addTableField[i].flag == 0){
				$scope.defaultPar = true;
				break;
			}
		}
	}
	// 是否为外部表函数
	$scope.isLocaChange = function(location){
		if(location == 1){
			$scope.externalDis = true;
		}else if(location == 0){
			$scope.externalDis = false;
		}
	}

	$scope.ok = function() {
		var flag = true;
		for(var i in $scope.addTableField){
			if(angular.isUndefined($scope.addTableField[i].fieldName) || $scope.addTableField[i].fieldName == ''){
				flag = false;
				break;
			}
		}
		if(flag){
			if($scope.addTabInfo.tabelName && $scope.addTableField.length > 0){
				if($scope.externalDis == false){
					$scope.submitAddData();
				}else if($scope.externalDis == true){
					if(angular.isUndefined($scope.addTabInfo.location)){
						toastr.error('请填写必填项');
					}else{
						$scope.submitAddData();
					}
				}
			}else{
				toastr.error('请填写必填项');
			}
		}else{
			toastr.error('请填写合格字段名，包含且只字母下划线');
		}
	};

	$scope.submitAddData = function() {
		var postBody = {};
		postBody = {
			dbName: $scope.dbName,  // 库名
			tabelName: $scope.addTabInfo.tabelName,  // 表名
			metaTableField: $scope.addTableField,  //  字段信息
			metaDataDescribe: $scope.addTabInfo.metaDesc, // 描述信息
			is_partition: $scope.addTabInfo.defaultPar, // 是否分区
			isExternal: $scope.addTabInfo.isLocation, // 是否为外部表
			location: $scope.addTabInfo.location //  外部表地址
		}
		ngResource.Add('psdon-web/hiveTable/add', {}, postBody).then(function(data) {
			if(data.returnCode == "000000"){
				toastr.success('新增成功');
			}else if(data.returnCode == "999999"){
				toastr.error(data.returnMessage);
			}else if(data.returnCode == overTimeCode) {
				ngDialog.closeAll();
				$state.go('login');
			}
			ngDialog.closeAll();
			$scope.tableParams.page(1);
			$scope.tableParams.reload();
		});
	};
});