/*
 * auth Lishanming_
 * date 2017年5月1日 15:56:45
 * description 项目启动配置
 */
var App;
(function() {
	'use strict'

	/*声明主模块*/
	App = angular.module('DSMP', [
		'ui.router',
		'ngResource',
		'cfp.loadingBarInterceptor',
		'ngTable',
		'ncy-angular-breadcrumb',
		'mgo-angular-wizard',
		'ui.select',
		'ngSanitize',
		// 'ngAnimate',
		'ngDialog',
		'toastr',
		'ui.bootstrap',
		'base64'
	]);
	
	/*angular启动方法，run方法可由多个*/
	App.run(function($rootScope, $state, $stateParams, $templateCache) {

		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;

		///监听路由切换开始事件：路由级别的权限控制
		// addRouterStartListener($rootScope, $state);
	});

	//设置XHR可携带Cookies，并且后端设置origin为我的域，则会保存后端返回的cookie
	App.config(["$httpProvider", function($httpProvider) {

		$httpProvider.defaults.withCredentials = true;
	}]);

	//配置toastr：自动消失时间，出现位置
	App.config(function(toastrConfig) {
		angular.extend(toastrConfig, {
			timeOut: 2500,
			positionClass: 'toast-top-center'
		});
	});

	//angular启动
	angular.element(document).ready(function() {
		angular.bootstrap(document, ['DSMP']);
	});

	/*路由切换，监听方法*/
	function addRouterStartListener($rootScope, $state) {

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

			//目前暂时只做：必须登录后才可以进入除登录外的其他页面
			if(toState.name != "login" && angular.isUndefined(window.sessionStorage.userName)) {
				event.preventDefault();
				$state.go('login');
			}
		});
	}

})();