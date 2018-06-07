'use strict'

App.controller('headerCtrl', function($scope,$state,ngResource,ngDialog,$rootScope) {
	$rootScope.headerUserName=window.sessionStorage.userName;
	$scope.exitBtn=function(){
		var param={
			'userName':$scope.headerUserName
		};
		ngResource.Query('psdon-web/loginController/logout',param).then(function(data) {
			if(data.returnCode == '1') {
				$state.go('login');
			} else if(data.returnCode==overTimeCode){
				$state.go('login');
			}
		});
	}

	$scope.updatePsd=function () {
        $scope.dialogTitle = "修改密码";
        ngDialog.open({
            scope: $scope,
            width: 600,
            template: 'app/pages/layout/updatePsd.html',
            controller: 'updatePsdCtrl'
        });
    }
});