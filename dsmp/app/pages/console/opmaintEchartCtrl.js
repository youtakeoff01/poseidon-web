'use strict';
/*
 * auth 杨丽娟
 * date 2017-08-08
 * description 运维中心-任务运维图表
 */
App.controller('opmaintEchartCtrl', function($location, $stateParams, $rootScope, $state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
	var colorList = ['#59C4A6', '#51B8FD', '#F9827C', '#FFA55E', '#28727b', '#ff8463', '#9bca64', '#fbd860', '#f3a43b', '#61c0de', '#d7504c', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'];
	// //服务状态数据的获取
	// $scope.serverState = [];
	// $scope.$on("machineId", function(e, m) {
	// 	console.log("3333=" + e);
	// 	console.log("4444=" + m);
	// })

	// table列表数据存放
	$scope.timeSort = [];
	$scope.failuresOrder = [];
	// 执行情况饼图数据获取
	function getTextPerformance() {
		ngResource.Query('psdon-web/consoleController/getTaskExec','').then(function(data) {
			if(data.returnCode == '1') {
				for(var i=0; i<data.returnObject.length; i++){
					$scope.dataOption.series[0].data[i].value = data.returnObject[i].count;
				}
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}

		}, function(reject) {

		});
	} 
	// 任务量折线图数据获取
	function getTaskNum(type) {
		ngResource.Add('psdon-web/consoleController/getTaskCount', {taskType: type}, {}).then(function(data) {
			if(data.returnCode == '1') {
				for(var i=0; i<data.returnObject.length; i++){
					if(data.returnObject[i].timeType == 0){ //今天
						$scope.systemOptionAll.series[1].data = data.returnObject[i].list;
					} else if(data.returnObject[i].timeType == 1){  // 昨天
						$scope.systemOptionAll.series[0].data = data.returnObject[i].list;
					}
				}
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}

		}, function(reject) {

		});
	}
	// 任务执行时间排序数据获取
	// 用于分页（后台没有做分页）
	$scope.timePgOne = true;
	$scope.timePgTwo = false;
	$scope.errorPgOne = true;
	$scope.errorPgTwo = false;
	$scope.total;
	$scope.errorTotal;
	$scope.tableParamsOne = new NgTableParams({
		page: 1,
		count: 10,
		sorting: {}
	}, {
		counts: [],
		total: $scope.timeSort.length,
		getData: function($defer, params) {
			var param = {
				'startPage': params.page(),
				'count': params.count(),
			};
			ngResource.Query('psdon-web/consoleController/getExecTime', param).then(function(data) {
				if(data.returnCode == '1') {
					params.total(data.returnObject.counts);
					$defer.resolve($scope.queryData);
					$scope.total = data.returnObject.length;
					$scope.timeSort = angular.copy(data.returnObject);
				} else if(data.returnCode == overTimeCode) {
					$state.go('login');
				}
			});
		}
	});
	
	// 执行失败次数排序获取
	$scope.tableParamsTwo = new NgTableParams({
		page: 1,
		count: 10,
		sorting: {}
	}, {
		counts: [],
		total: $scope.failuresOrder.length,
		getData: function($defer, params) {
			var param = {
				'startPage': params.page(),
				'count': params.count(),
			};
			ngResource.Query('psdon-web/consoleController/getErrorCount').then(function(data) {
				if(data.returnCode == '1') {
					params.total(data.returnObject.counts);
					$defer.resolve($scope.queryData);
					$scope.errorTotal = data.returnObject.length;
					$scope.failuresOrder = angular.copy(data.returnObject);
				} else if(data.returnCode == overTimeCode) {
					$state.go('login');
				}
			});
		}
	});

	getTextPerformance();
	getTaskNum();
	//环形图
	$scope.dataConfig = {
		theme: 'macarons',
		dataLoaded: true,
		event: [{
			click: onClick
		}]
	};
	$scope.dataOption = {
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b}: {c} ({d}%)"
		},
		legend: {
			orient: 'horizontal',
			bottom: 1,
			data:['未完成','运行中','运行成功','运行失败'],
		},
		
		series: [
			{
				name:'任务情况',
				type:'pie',
				center: ['50%', '45%'],
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '20',
							fontWeight: 'bold',
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data:[
					{ name:'运行中', itemStyle:{normal:{color:'#c8c8c8'}} },
					{ name:'运行成功', itemStyle:{normal:{color:'#2eaefe'}} },
					{ name:'运行失败', itemStyle:{normal:{color:'#4cbf2b'}} },
					{ name:'未完成', itemStyle:{normal:{color:'#f94541'}} },
				]
			}
		],
	};

	// 点击不同任务类型
	$scope.missionType = [
		{
			name: '任务类型: ',
			value: false
		},
		{
			name: '全部',
			value: true
		},
		{
			name: '同步任务',
			value: false
		},
		{
			name: '开发任务',
			value: false
		},{
			name: '提交任务',
			value: false
		}
	]
	$scope.mission = true;
	$scope.changeType = function(index){
		var type;
		if($scope.missionType[index].name == '开发任务'){
			type = '1';
		}else if($scope.missionType[index].name == '同步任务'){
			type = '0'
		}else if($scope.missionType[index].name == '提交任务'){
			type = '4'
		}
		if(index != 0){
			for(var i=1; i<$scope.missionType.length; i++){
				$scope.missionType[i].value = false;
			}
			$scope.missionType[index].value = true;
			getTaskNum(type);
		}
	}
	//不同任务类型的折线图
		// 全部
	$scope.systemConfigAll = {
		theme: 'macarons',
		dataLoaded: true
	};
	$scope.systemOptionAll = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			bottom: '12%',
			orient: 'horizontal',
			data:['昨日','今日']
		},
		grid: {
			left: '2%',
			right: '2%',
			top: '10%',
			bottom: '30%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				name:'昨日',
				type:'line',
				itemStyle:{normal:{color:'#69e3ff'}}
			},
			{
				name:'今日',
				type:'line',
				itemStyle:{normal:{color:'#4581ff'}}
			},
			/* {
				name:'历史平均',
				type:'line',
				data:[],
				itemStyle:{normal:{color:'#4cbf2b'}}
			} */
		]
	}
	
	// 饼图加点击事件
	function onClick(params){	
		$scope.$apply(function(){
			if(params.data.name == '运行中'){
				$rootScope.addMenuTabs('任务运维','operCase','1');
			}else{
				$rootScope.addMenuTabs('任务运维','operCase','2','',params.data.name);
			}
		})
	}

});