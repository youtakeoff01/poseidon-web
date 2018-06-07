'use strict';
/*
 * auth yanglijuan
 * date 2017-05-25
 * description 我的数据-数据源管理
 */
App.controller('addSourceCtrl', function($state, $scope, ngDialog, ngResource, toastr) {
	$scope.addSourceData = {};
	$scope.addSourceData.dbType = {};

	$scope.selectData = [{
		id: '1',
		name: 'MySQL'
	}, {
		id: '2',
		name: 'Oracle'
	},{
        id: '3',
        name: 'SQLServer'
    },{
        id: '4',
        name: 'PostgreSQL'
    },{
		id: '5',
		name: 'DB2'
	},{
        id: '6',
        name: 'Hive'
    }];
	$scope.addSourceData.dbType = $scope.selectData[0];

	//名字校验
	$scope.checkName = function(name) {
		if(name != "") {
			var checkNameData = {
				'srcName': name
			};
			ngResource.Query('psdon-web/dbSrcController/checkSrcName', checkNameData).then(function(data) {

				$scope.editCode = data.returnCode;
				if(data.returnCode == '1') {
					toastr.error("该名称已经存在！");
				} else if(data.returnCode == overTimeCode) {
					ngDialog.closeAll();
					$state.go('login');
				}
			});
		}
	}

	//联通测试
	$scope.afterTestSucceed = false;
	$scope.getConStatus = function(con) {

		var postBody = {
			"srcName": con.srcName,
			"dbType": con.dbType.name,
			"dbUser": con.dbUser,
			"dbUrl": con.dbUrl,
			"dbPwd": con.dbPwd,
			"dbName": con.dbName
		}
		ngResource.Query('psdon-web/dataSourceController/getConnectionStatus', postBody).then(function(data) {
		
			if(data.returnCode == overTimeCode) {
				//如果超时，返回界面
				ngDialog.closeAll();
				$state.go('login');
			} else {
				$scope.addStatus = data.returnCode;
				if(data.returnCode == 1 ){
					$scope.afterTestSucceed = true;
				} else {
					$scope.afterTestSucceed = false;
				}
			}
		});
	};

	$scope.ok = function() {
		if($scope.addSourceData.srcName == undefined){

			toastr.error('请填写必填项');
		} else{
			var postBody = {
				"srcName": $scope.addSourceData.srcName,
				"dbType": $scope.addSourceData.dbType.name,
				"dbUser": $scope.addSourceData.dbUser,
				"dbUrl": $scope.addSourceData.dbUrl,
				"dbPwd": $scope.addSourceData.dbPwd,
				"dbName": $scope.addSourceData.dbName
			}
			//console.log(postBody);
			if ($scope.addStatus == 1 && $scope.editCode == 0) {
	
				ngResource.Add('psdon-web/dbSrcController/insertDBSrc', {}, postBody).then(function(data) {
					if(data.returnCode == '1') {
						toastr.success('新增成功');
					} else {
						toastr.error(data.returnMessage);
					}
					$scope.selected=[];
					$scope.afterTestSucceed = false;
					$scope.tableParams.reload();
					ngDialog.closeAll();
				});
	
			} else if ($scope.addStatus != 1) {
				toastr.error('必须进行联通测试');
			} else if ($scope.editCode != 0) {
				toastr.error('该名称已存在！');
			}
		}
	}
});