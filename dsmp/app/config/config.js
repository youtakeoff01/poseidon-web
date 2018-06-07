/**
 * @author yanglijuan
 * created on 2017-05-22
 */

	'use strict';
	/*不知道啥意思，待研究*/
	App.config(["$provide", "$compileProvider", "$controllerProvider", "$filterProvider",
		function($provide, $compileProvider, $controllerProvider, $filterProvider) {
			App.controller = $controllerProvider.register;
			App.directive = $compileProvider.directive;
			App.filter = $filterProvider.register;
			App.factory = $provide.factory;
			App.service = $provide.service;
			App.constant = $provide.constant;
		}
	]);

	/*配置头部的缓冲进度条*/
	App.config(function(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeSpinner = true;
	});

	/*配置懒加载*/
	/*App.config(["$ocLazyLoadProvider", "Modules_Config", function routeFn($ocLazyLoadProvider, Modules_Config) {
		$ocLazyLoadProvider.config({
			debug: false,
			events: false,
			modules: Modules_Config
		});
	}]);*/

	/*配置面包屑导航的默认*/
	App.config(function($breadcrumbProvider) {
		$breadcrumbProvider.setOptions({
			prefixStateName: 'app',
			template: 'bootstrap3'
		});
	});

	/*模态框配置*/
	App.config(['ngDialogProvider', function (ngDialogProvider) {
		ngDialogProvider.setDefaults({
			showClose: false,
			closeByDocument: false,
			closeByEscape: false,
			appendClassName: 'ngdialog-custom'
		});
	}]);
