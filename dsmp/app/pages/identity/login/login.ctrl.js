/*
 * auth yanglijuan
 * date 2017-06-01
 * description 登录控制器
 */
(function() {
	'use strict'
	App.controller('loginCtrl', function($scope, $state, ngResource) {
		var queryParam;
		
		// 点击登录
		
		$scope.isldapuser = true;
		$scope.login = function() {
			var temp = '';
			if($scope.isldapuser == true) {
				temp = '0';
			} else {
				temp = '1';
			}

			if(checkData() == false) {
				$scope.loginFailed = true;
				$scope.loginFailMessage = '帐号密码不可为空';
				return;
			}

			queryParam = {
				'userName': $scope.user.name,
				'password': $scope.user.password,
				'ldapuser': temp
			};
			
			ngResource.Query('psdon-web/loginController/login', queryParam).then(function(data) {
				if(data.returnCode == 1) {
					$scope.loginFailed = true;
					$scope.user = data.user;
					window.sessionStorage.userName = data.returnObject.user.realName;
					window.sessionStorage.userId = data.returnObject.user.id;
					window.sessionStorage.menuList = data.returnObject.menuList;
					window.sessionStorage.accountName = data.returnObject.user.userName;
					$state.go('app');
				} else {
					$scope.loginFailed = true;
					$scope.loginFailMessage = "账号密码错误，登录失败";
				}

			}, function(reject) {

			});
		}

		$scope.myKeyup = function(e) {
			var keycode = window.event ? e.keyCode : e.which;
			if(keycode == 13) {
				$scope.login();
			}
		};

		// 监听是否有本地存储cookie
		$scope.$on('$viewContentLoaded', function() {
			if(angular.isDefined(localStorage.user_remembered)) {
				$scope.user.name = localStorage.user_remembered;
				$scope.isRemember = true;
			}
		});
		$scope.user ={};
		var checkData = function() {
			if(isEmpty($scope.user.name) || isEmpty($scope.user.password)) {
				return false;
			} else {
				return true;
			}
		};

	});
})();