'use strict';
/*
 * auth 杨丽娟
 * date 2017-09-29
 * description 机器学习详情
 */
App.controller('machineDetailCtrl', function($rootScope, $stateParams, $interval, $state, $scope, ngDialog, ngResource, toastr) {
	$scope.mJsonData = "";
	$scope.tablesData = [];

	$rootScope.pyPortModel = "";
	$scope.textModel = "";

	console.log("获取的id=" + $rootScope.machineId);
	console.log("sdfsdf=" + $rootScope.machineId); //接收广播
	var params = {
		'id': $rootScope.machineId
	}

	$scope.getViewPortHeight = document.documentElement.clientHeight;
	$scope.leftHeightDiv = {
		"height": $scope.getViewPortHeight - 300
	};
	$scope.fromTabDiv = {
		"height": $scope.getViewPortHeight - 300
	};
	$scope.machineDiv = {
		"height": $scope.getViewPortHeight - 300
	};
	$scope.editDetailId = "";
	$rootScope.machineFlag = false;
	$scope.rightNode = "";
	//节点的修改
	$rootScope.editMachineName = "";

	//组件的查找
	$scope.getModelNode = function() {
		var params = {
			'userName': window.sessionStorage.accountName,
			'modelTyp': 'task'
		}
		ngResource.Query('psdon-web/modelController/listAIModel', params).then(function(data) {
			if(data.returnCode == '1') {
				$scope.modelData = data.returnObject;
			} else if(data.returnCode == '0') {
				toastr.error(data.returnMessage);
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}

		});
	}
	document.getElementById("menuDetailA").style.display = "none";
	document.getElementById("menuDetailB").style.display = "none";
	document.getElementById("menuDetailC").style.display = "none";

	document.getElementById("tip-upM").style.display = "none";
	document.getElementById("tip-downM").style.display = "none";

	document.getElementById("c2").oncontextmenu = function(e) {

		if($scope.editDetailId != "") {
			console.log("右键事件取消");
			e.preventDefault();
			var menu;
			if($scope.rightNode == "a") {
				console.log("AAAAAA");
				menu = document.querySelector("#menuDetailA");
			} else if($scope.rightNode == "b") {
				console.log("bbbbb");
				menu = document.querySelector("#menuDetailB");
			} else if($scope.rightNode == "c") {
				console.log("ccccc");
				menu = document.querySelector("#menuDetailC");
			}
			//根据事件对象中鼠标点击的位置，进行定位
			menu.style.left = e.offsetX + 'px';
			menu.style.top = e.offsetY + 'px';

			//改变自定义菜单的宽，让它显示出来
			menu.style.display = "block";
		}

	}

	document.getElementById("c2").onclick = function(e) {　　
		document.getElementById("tip-upM").style.display = "none";
		document.getElementById("tip-downM").style.display = "none";
	}

	document.getElementById("c2").onmousemove = function(e) {　　
		document.getElementById("menuDetailA").style.display = "none";
		document.getElementById("menuDetailB").style.display = "none";
		document.getElementById("menuDetailC").style.display = "none";
	}

	//左侧数据的查询

	ngResource.Query('psdon-web/comController/listAITree', "").then(function(data) {
		if(data.returnCode == '1') {
			$scope.tablesData = data.returnObject;
			console.log("左侧树=" + $scope.tablesData);
		} else if(data.returnCode == overTimeCode) {
			$state.go('login');
		}
	});

	$scope.saveTabClick = function() {

		$scope.jsonData = net.save();
		var params = {
			"taskName": $rootScope.machineName,
			"json": $scope.jsonData,
			"optsEntity": $scope.allOptionData

		}
		ngResource.Query('psdon-web/comController/updateAITask', params).then(function(data) {
			if(data.returnCode == '1') {
				toastr.success("保存成功");
			} else if(data.returnCode == '0') {
				toastr.error("保存失败");
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}

		});

	}

	$scope.openExectue = function() {
		$scope.jsonData = net.save();
		$rootScope.pyPortModel = $scope.textModel;
		if($scope.allOptionData.length == 0) {
			toastr.error("请填写数据");

		} else {
			$scope.mid = 'c2';
			$scope.dialogTitle = "机器学习日志";
			ngDialog.open({
				scope: $scope,
				width: 600,
				template: 'app/pages/machineLearning/machine/machineLog.html',
				controller: 'machineLogCtrl',
				appendClassName: 'ngDialogMachine'
			});
		}

	}
	var Util = G6.Util;
	// 锚点样式
	G6.Global.anchorPointStyle = {
		fill: '#108EE9',
		lineWidth: 0.1,
		r: 4
	};
	// 锚点激活样式
	G6.Global.anchorPointHoverStyle = {
		lineWidth: 6,
		stroke: '#108EE9',
		strokeOpacity: 0.2
	};
	// 第一步：注册节点
	G6.registNode('customNode', {
		draw: function(cfg, group) {
			var shape = group.addShape('rect', {
				attrs: {
					x: cfg.x,
					y: cfg.y,
					width: 90,
					height: 30,
					radius: 15,
					fill: '#fff',
					stroke: 'green'
				}
			});
			group.addShape('text', {
				attrs: {
					x: cfg.x + 40,
					y: cfg.y + 20,
					textAlign: 'center',
					fill: 'black',
					text: cfg.origin.title
				}
			});
			return shape;
		},
		getAnchorPoints: function(cfg) {
			var model = cfg.model;
			// 将锚点与数据源关联
			return model.anchorPoints;
		}
	}, 'rect');

	var save = $('#save');
	var net = new G6.Net({
		id: 'c2', // 容器ID
		mode: 'edit',
		height: 450 // 画布高
	});
	var cnodes; // 被禁止操作的节点集
	var behaviourSignal = net.get('behaviourSignal');
	var dragging = false;
	net.removeBehaviour(['hoverNodeShowAnchor', 'dragEdgeEndHideAnchor', 'dragNodeEndHideAnchor']);

	$scope.allOptionData = [];
	// $scope.tabsData=[];

	$scope.addCustomNode = function(row) {

		var pointData;
		if(row.in_out == '0-1') {
			pointData = [
				[0.5, 1]
			]
		} else if(row.in_out == '0-2') {
			pointData = [
				[0.25, 1],
				[0.5, 1]
			]
		} else if(row.in_out == '0-3') {
			pointData = [
				[0.25, 1],
				[0.5, 1],
				[0.75, 1]
			]
		} else if(row.in_out == '1-0') {
			pointData = [
				[0.5, 0]
			]
		} else if(row.in_out == '1-1') {
			pointData = [
				[0.5, 0],
				[0.5, 1]
			]
		} else if(row.in_out == '1-2') {
			pointData = [
				[0.5, 0],
				[0.25, 1],
				[0.5, 1]
			]
		} else if(row.in_out == '1-3') {
			pointData = [
				[0.5, 0],
				[0.25, 1],
				[0.5, 1],
				[0.75, 1]
			]
		} else if(row.in_out == '2-0') {
			pointData = [
				[0.25, 0],
				[0.5, 0]
			]
		} else if(row.in_out == '2-1') {
			pointData = [
				[0.25, 0],
				[0.5, 0],
				[0.5, 1]
			]
		} else if(row.in_out == '2-2') {
			pointData = [
				[0.25, 0],
				[0.5, 0],
				[0.25, 1],
				[0.5, 1]
			]
		} else if(row.in_out == '2-3') {
			pointData = [
				[0.25, 0],
				[0.5, 0],
				[0.25, 1],
				[0.5, 1],
				[0.75, 1]
			]
		} else if(row.in_out == '3-0') {
			pointData = [
				[0.25, 0],
				[0.5, 0],
				[0.75, 0]
			]
		} else if(row.in_out == '3-1') {
			pointData = [
				[0.25, 0],
				[0.5, 0],
				[0.75, 0],
				[0.5, 1]
			]
		} else if(row.in_out == '3-2') {
			pointData = [
				[0.25, 0],
				[0.5, 0],
				[0.75, 0],
				[0.25, 1],
				[0.5, 1]
			]
		} else if(row.in_out == '3-3') {
			pointData = [
				[0.25, 0],
				[0.5, 0],
				[0.75, 0],
				[0.25, 1],
				[0.5, 1],
				[0.75, 1]
			]
		} else if(row.in_out == '4-2') {
			pointData = [
				[0.2, 0],
				[0.4, 0],
				[0.6, 0],
				[0.8, 0],
				[0.25, 1],
				[0.5, 1]
			]
		} else if(row.in_out == undefined) {
			pointData = [
				[0.5, 1]
			]
		}

		net.beginAdd('node', {
			shape: 'customNode',
			title: row.comName,
			anchorPoints: pointData
		});
		$scope.userName=row.userName;
		$scope.taskName=row.taskName;
	}

	$scope.changeTab = 0;
	$scope.tempId = "";

	net.on('click', function(ev) {
		var item = ev.item;
		if(item) {
			$scope.tempId = item._attrs.id;
			timeDetail = $interval(function() {
				if($scope.tempId != undefined) {
					for(var j = 0; j < $scope.allOptionData.length; j++) {
						if($scope.allOptionData[j].comNum == $scope.tempId && $scope.allOptionData[j].tab == 1) {
							$scope.tabDetailActive = j;
						}
					}
				}
			}, 60);
		}
	});

	net.on('dragstart', function(ev) {
		dragging = true;
	});
	net.on('dragend', function(ev) {
		dragging = false;
	});
	var timeDetail;
	var editMachineTemp = "";
	//鼠标移入
	net.on('mouseenter', function(ev) {
		var shape = ev.shape;
		if(shape && shape.hasClass('anchor-point') && !dragging) {
			net.beginAdd('edge', {
				shape: 'smooth'
			});
		}

		$scope.rightNode = "";
		$scope.editDetailId = ev.item._attrs.id;
		editMachineTemp = $scope.editDetailId;
		$rootScope.editMachineName = ev.item._attrs.model.title;

		for(var j = 0; j < $scope.allOptionData.length; j++) {
			if($scope.allOptionData[j].comNum == $scope.editDetailId) {
				var descData = [];
				var tempIndex = shape.get('index');
				var upLength;

				if(tempIndex != undefined) {
					if($scope.allOptionData[j].flowDesc != undefined) {
						descData = $scope.allOptionData[j].flowDesc.split(",");
						upLength = $scope.allOptionData[j].inNum;
					}

					console.log("入口口" + upLength);
					if(tempIndex > upLength - 1) {

						document.getElementById("tip-upM").style.display = "none";
						var downStr = document.querySelector("#tip-downM");
						$scope.downData = descData[tempIndex];
						downStr.innerHTML = $scope.downData;
						//根据事件对象中鼠标点击的位置，进行定位
						downStr.style.left = ev.domEvent.offsetX + 10 - downStr.scrollWidth / 2 + 'px';
						downStr.style.top = ev.domEvent.offsetY + 10 + 'px';
						downStr.style.display = 'block';
						console.log("出口宽度" + downStr.scrollWidth);
					} else {

						document.getElementById("tip-downM").style.display = "none";
						var upStr = document.querySelector("#tip-upM");
						$scope.upData = descData[tempIndex];
						upStr.innerHTML = $scope.upData;
						//根据事件对象中鼠标点击的位置，进行定位
						upStr.style.left = ev.domEvent.offsetX - 50 + upStr.scrollWidth / 2 + 'px';
						upStr.style.top = ev.domEvent.offsetY - 40 + 'px';
						upStr.style.display = 'block';
						console.log("入口宽度" + upStr.scrollWidth);
					}
				}

				$scope.rightNode = $scope.allOptionData[j].rightOption;
			}
		}
	});

	//鼠标移除
	net.on('mouseleave', function(ev) {
		$interval.cancel(timeDetail);
		console.log("鼠标移除");
		var shape = ev.shape;
		var item = ev.item;
		var nodes = net.getNodes();
		$scope.editDetailId = "";

		document.getElementById("tip-upM").style.display = "none";
		document.getElementById("tip-downM").style.display = "none";

		if(shape && shape.hasClass('anchor-point')) {
			if(dragging) {
				if(!cnodes && behaviourSignal.draggingEdge) {
					cnodes = [];
					Util.each(nodes, function(node) {
						if(item !== node) {
							cnodes.push(node);
						}
					});
					Util.each(cnodes, function(node) {
						var anchorPoints = node.getAnchorPoints();
						Util.each(anchorPoints, function(point, index) {
							if(rdb()) {
								net.updateAnchor(node, index, {
									linkable: false,
									style: {
										fill: '#D0D0D0'
									},
									hoverStyle: {
										stroke: null
									}
								});
							} else {
								net.updateAnchor(node, index, {
									linkable: true,
									style: {
										fill: '#14B47E'
									},
									hoverStyle: {
										stroke: '14B47E'
									}
								});
							}
						});
					});
				}

			} else {
				net.changeMode('edit');
			}
		}
	});

	//删除节点
	$scope.removeMachineNet = function() {
		console.log("删除节点的id=" + editMachineTemp);

		net.remove(editMachineTemp);
		net.refresh();
		document.querySelector('#menuDetailA').style.width = '0px';
		document.querySelector('#menuDetailB').style.width = '0px';
		document.querySelector('#menuDetailC').style.width = '0px';
	}
	//查看节点日志
	$scope.searchMachineNet = function() {
		$scope.netLog = "c2";
		$scope.netLogID2 = editMachineTemp;
		$scope.dialogTitle = "查看节点日志";
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/machineLearning/machine/netLog.html',
			controller: 'netLogCtrl',
			appendClassName: 'ngDialogMachine'
		});
	}
	//查看节点
	$scope.checkMachineNet = function() {

		document.querySelector('#menuDetailA').style.display = "none";
		document.querySelector('#menuDetailB').style.display = "none";
		document.querySelector('#menuDetailC').style.display = "none";

		var checkDemo = [];
		console.log("查看节点的id=" + editMachineTemp);
		for(var j = 0; j < $scope.allOptionData.length; j++) {
			if($scope.allOptionData[j].comNum == editMachineTemp) {
				checkDemo.push($scope.allOptionData[j]);

			}
		}
		var params = {
			'optsEntity': checkDemo,
			'taskName':$scope.machineName
		}
		ngResource.Query('psdon-web/comController/getAIData', params).then(function(data) {
			if(data.returnCode == '1') {
				$scope.detailDataSearch = data.returnObject.data;
				$scope.detailcolumnData = data.returnObject.column;
				$scope.dialogTitle = "数据查询";
				ngDialog.open({
					scope: $scope,
					width: 600,
					template: 'app/pages/operationCenter/operManage/checkMachine.html',
					controller: 'checkMachineCtrl',
					appendClassName: 'ngDialogTable'
				});
			} else if(data.returnCode == '0') {
				toastr.error(data.returnMessage);
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}
		});

	}
	//查看评估报表
	$scope.reportMachineNet = function() {
		var checkDemo = [];
		console.log("查看节点的id=" + editMachineTemp);
		for(var j = 0; j < $scope.allOptionData.length; j++) {
			if($scope.allOptionData[j].comNum == editMachineTemp) {
				checkDemo.push($scope.allOptionData[j]);

			}
		}
		var params = {
			"userName": window.sessionStorage.accountName,
			'taskName': $rootScope.machineName
		}
		ngResource.Query('psdon-web/comController/getExecReport', params).then(function(data) {
			if(data.returnCode == '1') {
				$scope.netData = data.returnObject;
				$scope.dialogTitle = "查看评估报表";
				ngDialog.open({
					scope: $scope,
					width: 600,
					template: 'app/pages/machineLearning/machine/echartNet.html',
					controller: 'echartNetCtrl',
					appendClassName: 'ngDialogEchart'
				});
			} else if(data.returnCode == '0') {
				toastr.error(data.returnMessage);
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}
		});

	}
	//修改节点
	$scope.updateMachineNet = function() {
		console.log("修改节点的id=" + $rootScope.machineFlag);

		$scope.dialogTitle = "修改节点";
		ngDialog.open({
			scope: $scope,
			width: 1100,
			template: 'app/pages/operationCenter/operManage/editMachineNet.html',
			controller: 'editMachineNetCtrl'
		});

		document.querySelector('#menuDetailA').style.width = '0px';
		document.querySelector('#menuDetailB').style.width = '0px';
		document.querySelector('#menuDetailC').style.width = '0px';

	}

	var editData = $rootScope.$on('editMachineNode', function() {
		console.log($rootScope.updateMachineNode); //接收广播
		$rootScope.machineFlag = false;
		var item = net.find(editMachineTemp);
		net.update(item, {
			title: $rootScope.updateMachineNode
		});
		net.refresh();
		console.log("修改节点任务"); //接收广播
	})

	$scope.$on('$destroy', function() { //controller回收资源时执行
		editData(); //回收广播
	});
	net.tooltip(true);
	net.node().tooltip(obj => {
		return [
			['Id', obj.id],
			['节点名称', obj.title]
		];
	})

	// 拖拽边结束后重置锚点
	net.on('dragedgeend', function(ev) {
		var shape = ev.shape;
		var item = ev.item;
		var edge = ev.edge;
		// 如果没连接到锚点则删除该连接线
		if(shape && !shape.hasClass('anchor-point')) {
			net.remove(edge);
		}
		if(cnodes) {
			Util.each(cnodes, function(node) {
				var anchorPoints = node.getAnchorPoints();
				Util.each(anchorPoints, function(anchorPoint, index) {
					net.updateAnchor(node, index, {
						linkable: true,
						style: G6.Global.anchorPointStyle,
						hoverStyle: G6.Global.anchorPointHoverStyle
					});
				});
			});
			cnodes = undefined;
		}
	});
	// 节点绘制后显示锚点
	net.on('afteritemrender', function(ev) {

		var item = ev.item;

		if(Util.isNode(item)) {
			$scope.tempId = item._attrs.id;

			if($rootScope.machineFlag == false) {
				var tempObj = false;
				for(var j = 0; j < $scope.allOptionData.length; j++) {
					if($scope.allOptionData[j].comNum == $scope.tempId) {
						tempObj = true;
					}
				}
				console.log("节点的访问" + tempObj);
				if(tempObj == false) {
					var params = {
						'comName': item._attrs.model.title,
						'userName':$scope.userName,
		                'taskName':$scope.taskName
					}
					ngResource.Query('psdon-web/comController/getOpts', params).then(function(data) {
						if(data.returnCode == '1') {
							var str = data.returnObject.optsEntity;

							for(var j = 0; j < str.length; j++) {
								str[j].comNum = item._attrs.id;
								$scope.allOptionData.push(str[j]);
							}
							
						} else if(data.returnCode == overTimeCode) {
							$state.go('login');
						}
					});
				}
			} else if($rootScope.machineFlag == true) {
				for(var j = 0; j < $scope.allOptionData.length; j++) {
					if($scope.allOptionData[j].comNum == $scope.tempId) {
						$scope.allOptionData[j].comName = item._attrs.model.title;
					}
				}
				console.log("修改节点net.show");
			}

			net.showAnchor(item);
		}
	});

	function rdb() {
		var r = Math.random();
		return r > 0.5;
	}

	ngResource.Query('psdon-web/TaskController/getTask', params).then(function(data) {
		if(data.returnCode == '1') {

			$scope.allOptionData = data.returnObject.optsEntity;
			$scope.mJsonData = data.returnObject.json.source;

			timeDetail = $interval(function() {
				for(var j = 0; j < $scope.allOptionData.length; j++) {
					if($scope.allOptionData[j].comNum == $scope.tempId) {
						$scope.tabDetailActive = j;
					}
				}
			}, 60);

			net.source($scope.mJsonData.nodes, $scope.mJsonData.edges);
			net.render();

			console.log("标签页=" + $scope.tabDetailActive);
		} else if(data.returnCode == '0') {
			toastr.error("搜索失败！");
		} else if(data.returnCode == overTimeCode) {
			$state.go('login');
		}
	});

	$scope.openModel = function(indexId, indexString, nameString) {
		$scope.dialogTitle = "选择字段";
		$scope.jsonData = net.save();
		$scope.nodeId = indexId;
		$scope.optName = nameString;
		$scope.selectString = indexString;
		console.log("回填的数据=" + $scope.selectString);
		ngDialog.open({
			scope: $scope,
			width: 600,
			template: 'app/pages/machineLearning/machine/openMachine.html',
			controller: 'openMachineCtrl'
		});
	}

	$scope.matchRex = function(name, reg) {
		var result = name.match(reg);
		if(result == null)
			toastr.error('对不起，您输入的格式不正确!');
	}

	//hivetable查询表
	$scope.getdbTable = function(dbtable) {
		console.log(dbtable);
		console.log(dbtable.selectV);
		var param = {
			"dbName": dbtable.selectV
		}
		ngResource.Query('psdon-web/comController/getHiveTables', param).then(function(data) {
			if(data.returnCode == '1') {
				$scope.dbTableData = data.returnObject;

			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}
		});

	}

});