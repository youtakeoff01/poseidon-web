'use strict';
/*
 * auth yanglijuan
 * date 2017-05-25
 * description 我的数据-数据源管理
 */
App.controller('editSourceCtrl', function($state,$scope, NgTableParams, ngDialog, ngResource, toastr) {
    // console.log($scope.datetoBehind.dbType);
    var tempType=$scope.datetoBehind.dbType;
	$scope.editSourceData = $scope.datetoBehind;


	$scope.editSourceData.dbTypeEdit = $scope.editSourceData.dbType;

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

	// 判断数据库类型（赋初值）
	for(var i=0; i<$scope.selectData.length; i++){
		if(tempType == $scope.selectData[i].name){
			$scope.editSourceData.dbTypeEdit = $scope.selectData[i];
			break;
		}
	}



	//联通测试
	$scope.afterTestSucceed = false;
	$scope.getConStatus = function(con) {
		var postBody = {
			"srcName": con.srcName,
			"dbType": con.dbTypeEdit.name,
			"dbUser": con.dbUser,
			"dbUrl": con.dbUrl,
			"dbPwd": con.dbPwd,
			"dbName": con.dbName
		}

		ngResource.Query('psdon-web/dataSourceController/getConnectionStatus', postBody).then(function(data) {

			if(data.returnCode == overTimeCode) {
				ngDialog.closeAll();
				$state.go('login');
			} else {
				$scope.editStatus = data.returnCode;
				if(data.returnCode == 1 ){
					$scope.afterTestSucceed = true;
				} else {
					$scope.afterTestSucceed = false;
				}
			}
		});
	}
	/*确认修改*/
	$scope.ok = function() {
		var postBody = {
			"srcName": $scope.editSourceData.srcName,
			"dbType": $scope.editSourceData.dbTypeEdit.name,
			"dbUser": $scope.editSourceData.dbUser,
			"dbUrl": $scope.editSourceData.dbUrl,
			"dbPwd": $scope.editSourceData.dbPwd,
			"dbName": $scope.editSourceData.dbName,
			"id":$scope.editSourceData.id
		}

		if($scope.editStatus == 1) {
			ngResource.Update('psdon-web/dbSrcController/updateDBSrcsById', {}, postBody).then(function(data) {
				if(data.returnCode == '1') {

					ngDialog.closeAll();
					$scope.tableParams.reload();
					toastr.success('修改成功');
				} else {

					ngDialog.closeAll();
					$scope.tableParams.reload();
					toastr.error('修改失败');
				}
				$scope.afterTestSucceed = false;
			});
		} else {
			toastr.error('必须进行联通测试');
		}
	};

});