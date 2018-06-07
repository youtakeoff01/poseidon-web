'use strict';
/*
 * auth yanglijuan
 * date 2017-06-14
 * description 数据历史
 */
App.controller('sysSetCtrl', function($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
	$scope.sysData=[];
	//导出按钮
	$scope.openExcel = function() {
		var url = base_url + "psdon-webb/autoConfigController/downLoadConfigs";
		window.open(url);
	}
	//同步集群配置
	$scope.addConfig = function() {
		ngResource.Query('psdon-webb/autoConfigController/addConfigs', '').then(function(data) {
			if(data.returnCode == '1') {
				toastr.success("配置成功！");
			} else if(data.returnCode == '0') {
                toastr.error("配置失败！");
            }else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}
			// console.log("同步集群配置=" + data.returnMessage);
		});
	}
	//查询配置
	
		ngResource.Query('psdon-webb/autoConfigController/listConfigs', '').then(function(data) {
			if(data.returnCode == '1') {
				$scope.sysSetData = data.returnObject;

				$scope.sysSetData.forEach(function(value, index) {
					if(value.code == 'ambari_1001') {
						$scope.sysData.ambari_Name = value.configInfo;
					}
					if(value.code == 'ambari_1002') {
						$scope.sysData.ambari_user = value.configInfo;
					}
					if(value.code == 'ambari_1003') {
						$scope.sysData.ambari_psword = value.configInfo;
					}
					if(value.code == 'cache_1004') {
						$scope.sysData.cache_name = value.configInfo;
					}
					if(value.code == 'azkaban_1005') {
						$scope.sysData.azkaban_name = value.configInfo;
					}
					if(value.code == 'azkaban_1006') {
						$scope.sysData.azkaban_DB = value.configInfo;
					}
				});
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}
		});
	
	
	$scope.saveData = function(data) {

		if(data.ambari_Name!= "" && data.ambari_Name!=undefined 
		&& data.ambari_user!= "" && data.ambari_user!= undefined
		&& data.ambari_psword!= ""&& data.ambari_psword!= undefined 
		&& data.cache_name!= "" && data.cache_name!= undefined
		&& data.azkaban_name!= "" && data.azkaban_name!=undefined 
		&& data.azkaban_DB!= "" && data.azkaban_DB!= undefined) {
			selectData(data);
		}else{
			toastr.error("请填写必填项");
		}


	}

	function selectData(index) {
		var param = [{
			"code": "ambari_1001",
			"configInfo": index.ambari_Name,
			"xmlName": "Ambari Server",
			"configType": "string"
		}, {
			"code": "ambari_1002",
			"configInfo": index.ambari_user,
			"xmlName": "Ambari User",
			"configType": "string"
		}, {
			"code": "ambari_1003",
			"configInfo": index.ambari_psword,
			"xmlName": "Ambari Password",
			"configType": "string"
		}, {
			"code": "cache_1004",
			"configInfo": index.cache_name,
			"xmlName": "Cache Server",
			"configType": "string"
		}, {
			"code": "azkaban_1005",
			"configInfo": index.azkaban_name,
			"xmlName": "Azkaban Server",
			"configType": "string"
		}, {
			"code": "azkaban_1006",
			"configInfo": index.azkaban_DB,
			"xmlName": "Azkaban DB",
			"configType": "string"
		}];
		ngResource.Query('psdon-webb/autoConfigController/addToolsConfigs', param).then(function(data) {
			if(data.returnCode == '1') {
				toastr.success("保存成功");
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}
		});

	};

});