/*
 * auth yanglijuan
 * date 2017-05-22
 * description 登录控制器
 */
(function() {
	'use strict'
	App.controller('menuCtrl',function($rootScope, $scope, $state, ngResource, $base64) {
		$scope.isShow = false;
		$scope.isActive = false;

		$rootScope.menuTabs = [{
			'name': '控制台',
			'key': 'main',
			'active': true,
			'tabUrl': 'app/pages/console/opmaintEchart.html'
		}];
		$rootScope.scliceTabs = [{
			'name': '控制台',
			'key': 'main',
			'active': true,
			'tabUrl': 'app/pages/console/opmaintEchart.html'
		}];
		// 或者免登录
		var queryParam;
		if(window.location.hash){
			if(window.location.hash.indexOf('?')>0){
				var b = window.location.hash.substr(window.location.hash.indexOf('?')+1, window.location.hash.length)
				b = decodeURIComponent(b).split('&');
				var namePwd = [];
				for(var i=0; i<b.length; i++){
					var num = b[i].indexOf('=');
					namePwd.push(b[i].substr(b[i].indexOf('=')+1 , b[i].length))
				}
				queryParam = {	
					'userName': namePwd[0],
					'password': $base64.decode(namePwd[1])
				};
				ngResource.Query('psdon-web/loginController/login', queryParam).then(function(data) {
					if(data.returnCode == 1) {
						$scope.loginFailed = true;
						// $scope.user =  data.returnObject.user.realName;
						window.sessionStorage.userName = data.returnObject.user.realName;
						window.sessionStorage.userId = data.returnObject.user.id;
						window.sessionStorage.menuList = data.returnObject.menuList;
						window.sessionStorage.accountName = data.returnObject.user.userName;
						$rootScope.headerUserName=window.sessionStorage.userName;
						$state.go('app');
						//权限设置
						$scope.menuList = (window.sessionStorage.menuList);
						$scope.menuList = $scope.menuList.split(',');
						if($scope.menuList.length > 0) {
				
							$scope.consoleCode = changeList(consoleCode, contains($scope.menuList, consoleCode));
				
							$scope.IntegraCode = changeList(IntegraCode, contains($scope.menuList, IntegraCode));
							$scope.dataSourceCode = changeList(dataSourceCode, contains($scope.menuList, dataSourceCode));
							$scope.dataSyncCode = changeList(dataSyncCode, contains($scope.menuList, dataSyncCode));
							
							$scope.datamanagerCode = changeList(datamanagerCode, contains($scope.menuList, datamanagerCode));
							$scope.permissionCode = changeList(permissionCode, contains($scope.menuList, permissionCode));
							$scope.tableCode = changeList(tableCode, contains($scope.menuList, tableCode));
							$scope.fileCode = changeList(fileCode, contains($scope.menuList, fileCode));
				
							$scope.platformCode = changeList(platformCode, contains($scope.menuList, platformCode));
							$scope.syLogCode = changeList(syLogCode, contains($scope.menuList, syLogCode));
							$scope.sySetCode = changeList(sySetCode, contains($scope.menuList, sySetCode));
							$scope.userCode = changeList(userCode, contains($scope.menuList, userCode));


							$scope.centerCode = changeList(centerCode, contains($scope.menuList, centerCode));
							$scope.noticeCode = changeList(noticeCode, contains($scope.menuList, noticeCode));
							$scope.customCode = changeList(customCode, contains($scope.menuList, customCode));
							$scope.taskCode = changeList(taskCode, contains($scope.menuList, taskCode));
							$scope.caseCode = changeList(caseCode, contains($scope.menuList, caseCode));
							$scope.ruleCode = changeList(ruleCode, contains($scope.menuList, ruleCode))
				
							$scope.developCode = changeList(developCode, contains($scope.menuList, developCode));
							$scope.searchCode = changeList(searchCode, contains($scope.menuList, searchCode));
							$scope.tasksubmitCode = changeList(tasksubmitCode, contains($scope.menuList, tasksubmitCode));
							
							$scope.artiCode = changeList(artiCode, contains($scope.menuList, artiCode));
							$scope.machineCode = changeList(machineCode, contains($scope.menuList, machineCode));
							$scope.analysisCode = changeList(analysisCode, contains($scope.menuList, analysisCode));
							$scope.depthCode = changeList(depthCode, contains($scope.menuList, depthCode));
						}
	
					} else {
						$state.go('login');
					}
				}, function(reject) {
					//
				});

			}else if(window.location.hash.indexOf('?')<0 && angular.isUndefined(window.sessionStorage.userName)){
				$state.go('login');
			}
		} 
		
		//权限设置
		if(window.sessionStorage.menuList){
			$scope.menuList = (window.sessionStorage.menuList);
			$scope.menuList = $scope.menuList.split(',');
			if($scope.menuList.length > 0) {
	
				$scope.consoleCode = changeList(consoleCode, contains($scope.menuList, consoleCode));
	
				$scope.IntegraCode = changeList(IntegraCode, contains($scope.menuList, IntegraCode));
				$scope.dataSourceCode = changeList(dataSourceCode, contains($scope.menuList, dataSourceCode));
				$scope.dataSyncCode = changeList(dataSyncCode, contains($scope.menuList, dataSyncCode));
				
				$scope.datamanagerCode = changeList(datamanagerCode, contains($scope.menuList, datamanagerCode));
				$scope.permissionCode = changeList(permissionCode, contains($scope.menuList, permissionCode));
				$scope.tableCode = changeList(tableCode, contains($scope.menuList, tableCode));
				$scope.fileCode = changeList(fileCode, contains($scope.menuList, fileCode));
	
				$scope.platformCode = changeList(platformCode, contains($scope.menuList, platformCode));
				$scope.syLogCode = changeList(syLogCode, contains($scope.menuList, syLogCode));
				$scope.sySetCode = changeList(sySetCode, contains($scope.menuList, sySetCode));
				$scope.userCode = changeList(userCode, contains($scope.menuList, userCode));
				$scope.groupCode = changeList(groupCode, contains($scope.menuList, groupCode));
        $scope.groupCode = changeList(groupCode, contains($scope.menuList, groupCode));
        $scope.processCode = changeList(processCode, contains($scope.menuList, processCode));
        $scope.myapplyCode = changeList(myapplyCode, contains($scope.menuList, myapplyCode));
        $scope.myapproval = changeList(myapproval, contains($scope.menuList, myapproval));
	
				$scope.centerCode = changeList(centerCode, contains($scope.menuList, centerCode));
				$scope.noticeCode = changeList(noticeCode, contains($scope.menuList, noticeCode));
				$scope.customCode = changeList(customCode, contains($scope.menuList, customCode));
				$scope.taskCode = changeList(taskCode, contains($scope.menuList, taskCode));
				$scope.caseCode = changeList(caseCode, contains($scope.menuList, caseCode));
				$scope.ruleCode = changeList(ruleCode, contains($scope.menuList, ruleCode))
	
				$scope.developCode = changeList(developCode, contains($scope.menuList, developCode));
				$scope.searchCode = changeList(searchCode, contains($scope.menuList, searchCode));
				$scope.tasksubmitCode = changeList(tasksubmitCode, contains($scope.menuList, tasksubmitCode));
				
				$scope.artiCode = changeList(artiCode, contains($scope.menuList, artiCode));
				$scope.machineCode = changeList(machineCode, contains($scope.menuList, machineCode));
				$scope.analysisCode = changeList(analysisCode, contains($scope.menuList, analysisCode));
				$scope.depthCode = changeList(depthCode, contains($scope.menuList, depthCode));
			}
		}
		//计算屏幕可视宽度
		$(window).resize(function (){
			$scope.getViewPortHeight = document.documentElement.clientHeight;
			$scope.menu_wrap = {
				"height": $scope.getViewPortHeight - 50,
			};
		});

		$scope.doFirst = function(eleClass, state) {
			if($state.includes(state)) {
				angular.element('.' + eleClass).addClass("isActive");
			}
		}

		$scope.openFile = function() {
			window.open("app/markdownToc/posedionHelpCenter.html");
		}

		//计算界面可以展示多少标签
		// console.log("界面可以显示多少个标签=",$rootScope.menuNum);

		//用于计算切割的位置
		$rootScope.clickIndex = -1;
		// 点击增加菜单tab页面
		$rootScope.addMenuTabs = function(name, key, operCaseState,textName, textStatus) {
			// 用于判断任务运维页面是运行中还是完成状态
			if(operCaseState){
				$rootScope.executionShow = operCaseState;
			}else{
				$rootScope.executionShow = '1';
			}
			// 任务运维中任务名称
				// 监听对象
			$scope.foo = function(){
				return $rootScope.textName; 
			}
			if(textName && textName != ''){
				$rootScope.textName = textName.taskName;
			}else{
				$rootScope.textName = '';
			}
			// 任务运维中任务状态
			if(textStatus){
				$rootScope.textStatus = textStatus;
			}else{
				$rootScope.textStatus = '';
			}

			var user = new Object({});
			user.name = name;
			user.keyId = key;
			user.active = true;
			if(user.keyId == 'console') {
				user.tabUrl = 'app/pages/console/opmaintEchart.html';
			} else if(user.keyId == 'consolelist') {
				user.tabUrl = 'app/pages/console/opmaintList.html';
			} else if(user.keyId == 'file') {
				user.tabUrl = 'app/pages/dataIntegration/file/file.html';
			} else if(user.keyId == 'source') {
				user.tabUrl = 'app/pages/dataIntegration/source/source.html';
			} else if(user.keyId == 'sync') {
				user.tabUrl = 'app/pages/dataIntegration/sync/sync.html';
			} else if(user.keyId == 'permission') {
				user.tabUrl = 'app/pages/dataManagement/permission/permissionQuery.html';
			} else if(user.keyId == 'table') {
				user.tabUrl = 'app/pages/dataManagement/table/table.html';
			} else if(user.keyId == 'log') {
				user.tabUrl = 'app/pages/platformManage/log/log.html';
			} else if(user.keyId == 'sysSet') {
				user.tabUrl = 'app/pages/platformManage/sysSet/sysSet.html';
			} else if(user.keyId == 'userGroup') {
				user.tabUrl = 'app/pages/platformManage/userGroup/userGroup.html';
			} else if(user.keyId == 'userManage') {
				user.tabUrl = 'app/pages/platformManage/userManage/userManage.html';
			} else if(user.keyId == 'ditch') {
				user.tabUrl = 'app/pages/operationCenter/ditch/ditchWarn.html';
			} else if(user.keyId == 'custom') {
				user.tabUrl = 'app/pages/operationCenter/custom/customWarn.html';
			} else if(user.keyId == 'operManage') {
				user.tabUrl = 'app/pages/operationCenter/operManage/opmanage.html';
			} else if(user.keyId == 'history') {
				user.tabUrl = 'app/pages/operationCenter/operManage/opmanageHistory.html';
			} else if(user.keyId == 'operCase') {
				user.tabUrl = 'app/pages/operationCenter/operCase/opmaintCase.html';
			} else if(user.keyId == 'machineDetail') {
				user.tabUrl = 'app/pages/operationCenter/operManage/machineDetail.html';
			} else if(user.keyId == 'ruleManage'){
				user.tabUrl = 'app/pages/operationCenter/ruleManage/ruleManage.html';
			}else if(user.keyId == 'search') {
				user.tabUrl = 'app/pages/dataDevelopment/search/dataSearch.html';
			}else if(user.keyId == 'learning') {
				user.tabUrl = 'app/pages/machineLearning/machine/machineLearning.html';
			}else if(user.keyId == 'submitTask') {
				user.tabUrl = 'app/pages/dataDevelopment/task/submitTask.html';
			}else if(user.keyId == 'myapply') {
				user.tabUrl = 'app/pages/platformManage/processManage/myApply.html';
			}else if(user.keyId == 'myapproval') {
				user.tabUrl = 'app/pages/platformManage/processManage/myApproval.html';
			}
			// 如果为控制台，直接跳转到控制台。
			if(user.keyId != 'console'){
				if($rootScope.menuTabs.length != 0) {
					var temp = menuTabsList($rootScope.menuTabs, name);
					if(temp == false) {
						$rootScope.menuTabs.push(user);
					}
				} else {
					$rootScope.menuTabs.push(user);
				}
			}else{
				//如果是直接跳转到控制台，且激活
				for(i in $rootScope.menuTabs){
					$rootScope.menuTabs[i].active = false;
				}
				$rootScope.menuTabs[0].active = true;
			}
			
			// 用于判断是否可以左移
			$rootScope.leftMove = true;
			$rootScope.rightMove = false;
			// 如果超过显示菜单的最大值将进行割取
			$rootScope.clickIndex++;
			var lengthStr = $rootScope.menuTabs.length;

			// 判断tab栏已经存在clickIndex就不加
			for(var i=0; i<$rootScope.menuTabs.length; i++){
				if($rootScope.menuTabs[i].name == name){
					$rootScope.clickIndex--;
					break;
				}
			}
			// console.log('可以显示的tab页',$rootScope.menuNum)
			if (lengthStr > $rootScope.menuNum ) {
				//  多于就9项进行截取
				$rootScope.scliceTabs = $rootScope.menuTabs.slice($rootScope.clickIndex-$rootScope.menuNum+1, $rootScope.menuTabs.length);
			} else {
				// 右侧菜单总取9项
				$rootScope.scliceTabs = $rootScope.menuTabs.slice(0, $rootScope.menuNum);
			}

			// 来回切选(点击已经存在的)
			for(var i=0; i<$rootScope.menuTabs.length; i++){
				var exsitTab = false;
				$rootScope.menuTabs[i].active = false;
				if($rootScope.menuTabs[i].name == name){
					// 如果点击的不存在在右侧菜单栏里，则重新截取，0-9的数据
					for(var j=0; j<$rootScope.scliceTabs.length; j++){
						if($rootScope.scliceTabs[j].name == name){
							exsitTab = true;
							break;
						}
					}
					if(exsitTab){
						$rootScope.menuTabs[i].active = true;
					}else{
						$rootScope.scliceTabs = $rootScope.menuTabs.slice(0, $rootScope.menuNum);
						$rootScope.menuTabs[i].active = true;
					}
				}else{

				} 
			}
		}

		// 菜单栏折叠展开
		$scope.mini = true;
		$scope.folding = function(){
			$scope.mini = !$scope.mini;
		}

		// 获取div位置显示tip
		var tip = document.querySelector("#tip");
		var twoTip = document.querySelector("#twoTip");
		tip.style.display = 'none';
		twoTip.style.display = 'none';
			/* 第一级提示 */
		$scope.oneTip = function($event, cont){
			tip.style.display = 'block';
			$scope.tipContent = cont;
			// 获取到当前点击元素在页面中的坐标  
			var off = $($event.target).offset();  
			//根据事件对象中鼠标点击的位置，进行定位
			tip.style.left = off.left  + 70 + 'px';
			tip.style.top = off.top + 'px';
		}
		$scope.tipDisappear = function(){
			tip.style.display = 'none';
		} 
			/* 第二级提示 */
		$scope.twoTip = function($event, cont){
			tip.style.display = 'none';
			twoTip.style.display = 'block';
			$scope.twoTipCont = cont;
			// 获取到当前点击元素在页面中的坐标  
			var off = $($event.target).offset();  
			//根据事件对象中鼠标点击的位置，进行定位
			twoTip.style.left = off.left  + 65 + 'px';
			twoTip.style.top = off.top + 'px';
		}
		$scope.twoTipDisappear = function(){
			twoTip.style.display = 'none';
		} 
	});
})();	