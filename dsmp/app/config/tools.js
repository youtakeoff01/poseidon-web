/*
 * auth YiXing_
 * date 2017年5月1日 15:59:41
 * description 工具类，service+filter+directive
 */
(function() {
	'use strict';

	/*ngResource对象包装,此处header自动设置了Authorization，用于认证，所以登录，注册，找回密码等功能，采用原生的Resource*/
	App.factory('ngResource', ['$resource', '$q', function($resource, $q) {
		return {
			Query: function(url, queryPara) {

				var query_header = {
					'Authorization': window.localStorage.local_header
				};
				var resource_query = $resource(base_url + url, {}, {
					get: {
						method: 'post',
						headers: query_header
					}
				});
				var defer = $q.defer();
				resource_query.get(queryPara, function(data, header) {
					defer.resolve(data);
				}, function(response) {
					defer.reject(response);
				});
				return defer.promise;
			},
			Add: function(url, queryPara, formData) {
				var add_header = {
					'Authorization': window.localStorage.local_header
				};
				var resource_add = $resource(base_url + url, {}, {
					save: {
						method: 'post',
						headers: add_header
					}
				});
				var defer = $q.defer();
				resource_add.save(queryPara, formData, function(data, header) {
					defer.resolve(data);
				}, function(response) {
					defer.reject(response);
				});
				return defer.promise;
			},
			Update: function(url, queryPara, formData) {
				var update_header = {
					'Authorization': window.localStorage.local_header
				};
				var resource_update = $resource(base_url + url, {}, {
					update: {
						'method': 'post',
						headers: update_header
					}
				});
				var defer = $q.defer();
				resource_update.update(queryPara, formData, function(data, header) {
					defer.resolve(data);
				}, function(response) {
					defer.reject(response);
				});
				return defer.promise;
			},
			Delete: function(url, queryPara) {
				var delete_header = {
					'Authorization': window.localStorage.local_header
				};
				var resource_delete = $resource(base_url + url, {}, {
					delete: {
						'method': 'post',
						headers: delete_header
					}
				});
				var defer = $q.defer();
				resource_delete.delete(queryPara, function(data, header) {
					defer.resolve(data);
				}, function(response) {
					defer.reject(response);
				});
				return defer.promise;
			}
		}
	}]);

	//处理“安全的链接”问题
	App.filter('codeType', function() {
		return function(value, para) {
			var temp = eval(para);
			for(var i = 0; i < temp.length; i++) {
				if(temp[i].id == value) {
					return temp[i].desc;
				}
			}
		};
	});

	//处理“安全的链接”问题
	App.filter('svgIconCardHref', function($sce) {
		return function(iconId) {
			return $sce.trustAsResourceUrl('#icon-' + iconId);
		};
	});
	//针对阿里ICON的封装
	App.directive('funIcon', function() {
		return {
			restrict: 'AE',
			transclude: true,
			replace: true,
			scope: {
				iconId: '@id',
				iconClass: '@class'
			},
			template: '<svg class="icon {{iconClass}}" aria-hidden="true"><use xlink:href="{{ iconId | svgIconCardHref}}"></use></svg> ',
		};
	});

	App.directive('funIconTitle', function() {
		return {
			restrict: 'AE',
			transclude: true,
			replace: true,
			scope: {
				iconId: '@id',
				iconClass: '@class',
				titleName: '@title'
			},
			template: '<a title="{{titleName}}"><svg class="icon {{iconClass}}" aria-hidden="true"><use xlink:href="{{ iconId | svgIconCardHref}}"></use></svg></a> ',
		};
	});

	/*针对搜索中关键字的变色*/
	App.filter('keywordFilter', function($sce) {
		return function(words, key) {
			return $sce.trustAsHtml(words.replace(eval("/" + key + "/g"), '<span  style="color: red;">' + key + '</span>'));
		}
	});
	//自定义panel
	App.directive('funPanel', function() {
		return {
			restrict: 'AE',
			transclude: true,
			scope: {
				panelTitle: '@',
				panelMinWidth: '@'
			},
			templateUrl: 'app/pages/layout/panel.template.html'

		};
	});
	App.directive('ngEcharts', [function() {
		return {
			link: function(scope, element, attrs, ctrl) {
				var chart

				function refreshChart() {
					var theme = (scope.config && scope.config.theme) ?
						scope.config.theme : 'default';
					chart = echarts.init(element[0], theme);
					if(scope.config && scope.config.dataLoaded === false) {
						chart.showLoading();
					}

					if(scope.config && scope.config.dataLoaded) {
						chart.setOption(scope.option);
						chart.resize();
						chart.hideLoading();
					}

					if(scope.config && scope.config.event) {
						if(angular.isArray(scope.config.event)) {
							angular.forEach(scope.config.event, function(value, key) {
								for(var e in value) {
									chart.on(e, value[e]);
								}
							});
						}
					}
				};
				//window.onresize =  chart.resize();
				window.onresize = function() {
					chart.resize();
				}

				//自定义参数 - config
				// event 定义事件
				// theme 主题名称
				// dataLoaded 数据是否加载

				scope.$watch(
					function() {
						return scope.config;
					},
					function(value) {
						if(value) {
							refreshChart();
						}
					},
					true
				);

				//图表原生option
				scope.$watch(
					function() {
						return scope.option;
					},
					function(value) {
						if(value) {
							refreshChart();
						}
					},
					true
				);
			},
			scope: {
				option: '=ecOption',
				config: '=ecConfig'
			},
			restrict: 'EA'
		}
	}]);

	//配置ui-select
	App.config(function(uiSelectConfig) {
		uiSelectConfig.theme = 'bootstrap';
	});

	//*配置ngDialog的默认参数*/
	App.config(['ngDialogProvider', function(ngDialogProvider) {
		ngDialogProvider.setDefaults({
			showClose: false,
			closeByDocument: false,
			closeByEscape: false,
			appendClassName: 'ngdialog-custom'
		});
	}]);

	/*对文件大小的处理，单位是B*/ //B KB M G
	App.filter('fileSize', function() {

		function handleDecimal(num, length) {
			var temp = num.toString();
			//首先，是否有小数点
			if(temp.indexOf('.') < 0) {
				return temp;
			}
			var pointLength = temp.indexOf('.');
			//判断小数点后需要精确到的位置是否是0
			if(temp[pointLength + length] != '0' && angular.isDefined(temp[pointLength + length])) {
				var str = temp.substring(0, pointLength + length + 1);
				if(str.indexOf('.') == str.length - 1) {
					return str.substring(0, str.length - 1);
				} else {
					return str;
				}
				//return temp.substring(0,pointLength+length+1)
				//return str;

			} else {
				return handleDecimal(temp, length - 1);
			}
		};
		return function(size) {

			size = parseInt(size);

			//console.log(Math.pow(1024,3));
			//console.log(Math.pow(1024,4));
			if(size < 1024) {
				return size + ' B';
			}
			if(1024 <= size && size < Math.pow(1024, 2)) {
				return size / 1024 + ' KB';
			}
			if(Math.pow(1024, 2) <= size && size < Math.pow(1024, 3)) {
				return handleDecimal(size / Math.pow(1024, 2), 2) + ' M';
			}
			if(Math.pow(1024, 3) <= size && size < Math.pow(1024, 4)) {
				return handleDecimal(size / Math.pow(1024, 3), 2) + ' G';
			}
			if(Math.pow(1024, 4) <= size && size < Math.pow(1024, 5)) {
				return handleDecimal(size / Math.pow(1024, 4), 1) + ' TB';
			}
		}

	});

	/*树组件*/
	App.directive('funTree', function() {
		return {
			restrict: "E",
			scope: {
				currentFolder: '='
			},
			templateUrl: 'app/pages/common/treeModel.html',
			controller: function($scope, $element) {
				$scope.itemActive = function($event, para) {
					/*if(para.root == 'true') //根节点，不做响应
					{
						return;
					}*/
					angular.forEach(angular.element('.tree-item-span'), function(data, index, array) {
						angular.element(data).removeClass("tree-item-active");
					});
					angular.element($event.currentTarget).addClass('tree-item-active');
					$scope.$emit("agencyChanged", para);
					$event.stopPropagation();
				};
			},
		};
	});

	/*随机颜色指令*/
	App.directive('funColor', function() {
		return {
			restrict: "A",
			scope: {
				colorList: '='
			},
			link: function(scope, ele, attrs, ctrl, trans) {
				var random = Math.floor(Math.random() * 1000 % scope.colorList.length);
				var color = scope.colorList[random];
				angular.element(ele).css("background-color", color);
			}
		};
	});

	//自定义弹窗模版
	App.directive('dialogTemplate', function() {
		return {
			restrict: 'AE',
			transclude: true,
			templateUrl: 'app/pages/common/ngDialogTemplate.html'
		};
	});

	// 自定义提示弹框（手动关闭）
	App.directive('tipTemplate', function() {
		return {
			restrict: 'AE',
			transclude: true,
			templateUrl: 'app/pages/common/ngTipTemplate.html'
		};
	});

	/*上传组件*/
	App.service('Uploader', function($q, $http) {
		//上传
		this.upload = function(serviceUrl, file, destination) {
			var paramData = new FormData();
			// paramData.append('uploadFile', file);
			for(var i=0 ; i<file.length; i++){
				paramData.append('file', file[i]);
			}
			paramData.append('dstPath', destination);
			return $http({
				method: 'POST',
				url: serviceUrl,
				data: paramData,
				// timeout: 1000,
				headers: {
					'Content-Type': undefined
				},
				transformRequest: angular.identity
			}).then(function(d) {
				return $q.when(d);
			}, function(d) {
				return $q.reject(d);
			});
		};

		//上传属性自定义
		this.uploadData = function(serviceUrl, file) {
			var paramData = new FormData();
			paramData.append('uploadFile', file);
			return $http({
				method: 'POST',
				url: serviceUrl,
				data: paramData,
				headers: {
					'Content-Type': undefined
				},
				transformRequest: angular.identity
			}).then(function(d) {
				return $q.when(d);
			}, function(d) {
				return $q.reject(d);
			});
		};
		
	});

	/*处理文件类型，返回响应的Icon图标ID*/
	App.filter('fileType', function() {
		return function(name, isDir) {
			if(isDir == true) {
				return 'wenjianjia';
			}
			//接着，我们知道它不是文件夹了，先拿它的后缀
			var suffix = name.substring(name.lastIndexOf('.'), name.length);

			/*然后，我们根据后缀来分配图标,考虑到视频有多种后缀，word 2007 和 2003也不同，所以不采用switch的语法*/

			//压缩文件
			if('rar,zip,7z,iso'.indexOf(suffix) >= 0) {
				return 'yasuowenjian';
			}
			//视频文件
			if('rm,rmvb,wmv,asf,asx,mpg,mpeg,mpe,3gp,mov,mp4,m4v,avi,dat,mkv,flv,vob'.indexOf(suffix) >= 0) {
				return 'video';
			}
			//txt文件
			if('txt' == suffix) {
				return 'txt';
			}
			//word文档
			if('doc,docx'.indexOf(suffix) >= 0) {
				return 'word';
			}
			//excel文档
			if('xls,xlsx'.indexOf(suffix) >= 0) {
				return 'excel';
			}
			//ppt文档
			if('ppt,pptx'.indexOf(suffix) >= 0) {
				return 'ppt';
			}
			//pdf文档
			if('pdf' == suffix) {
				return 'pdf';
			}

			//其他的，全视为附件
			return 'fujian';
		};
	});

	/*云文件树*/
	/*文件夹结构组件*/
	App.directive('directoryTree', function() {
		return {
			restrict: "E",
			scope: {
				currentFolder: '='
			},
			templateUrl: 'app/pages/common/directoryTreeModel.html',
			controller: function($scope, $element) {
				$scope.showChild = false;
				$scope.handleActive = function($event, para) {
					$scope.showChild = !$scope.showChild;

					angular.forEach(angular.element('.dt-title'), function(data, index, array) {
						angular.element(data).removeClass("dt-node-active");
					});
					angular.element($event.currentTarget).addClass('dt-node-active');

					$scope.$emit("fileDirChanged", para);

				};
			},
		};
	});

	/*按键监控指令 example <input fun-Keyboard="{method:'test'}" ></input>*/
	App.directive('funKeyboard', function() {
		return {
			restrict: "A",
			scope: {

			},
			link: function(scope, ele, attrs, ctrl, trans) {

				var key = "";
				var config = (new Function("return " + attrs.funKeyboard))();

				//如果没有配置键盘编码，则默认是回车键
				if(angular.isUndefined(config.keyCode)) {
					key = 13;
				} else {
					key = config.keyCode;
				}

				ele[0].onkeyup = function(event) {

					var e = event || window.event || arguments.callee.caller.arguments[0];

					if(e && e.keyCode == key) {
						eval('scope.$parent.' + config.method + '()');
					}
				};
			}
		};
	});

})();