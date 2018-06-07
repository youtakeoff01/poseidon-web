'use strict';
/*
 * auth yx
 * date 2017-11-27
 * description 表管理  表详细信息
 */
App.controller('tbDetCtrl', function($state, $scope,$rootScope,NgTableParams, ngDialog, ngResource, toastr) {
    $scope.back = function(){
        $rootScope.tabChge  = true;
        $scope.tabShow = 1;
    }
    $scope.tabShow = 1;
    // 切换tab页面函数
    $scope.pageChange = function(index){
        $scope.tabShow = index;
    }

    // 血缘关系部分
        // 获取上游血缘关系函数
    $scope.getupBlockRela = function(index){
        $scope.tabShow = index;
        var param = {
            guid: $rootScope.guId,
        }
        var relaInRoot = {};  // 用于存放树左边数据
        var relaOutRoot = {};   // 用于存放树右边数据
        console.log('上游')
        ngResource.Add('psdon-web/lineage/qry-inputs',{}, param).then(function(data) {
			if(data.returnCode == '1') {
                if(data.returnObject.inNodes == null){
                    relaInRoot = angular.copy(data.returnObject.inNodes);
                    //定义D3树布局范围  
                    var inTree = d3.layout.tree().size([400, 400]);
                    var inNodes = inTree.nodes(relaInRoot);   //获取所有节点信息  返回的为一个数组
                }else if(data.returnObject.inNodes != null){
                    relaInRoot = angular.copy(data.returnObject.inNodes);
                    relaOutRoot = angular.copy(data.returnObject.inNodes);
                    // 定义D3树布局范围  
                    var inTree = d3.layout.tree().size([400, 400]);
                    var outTree = d3.layout.tree().size([400, 400]);
                    // 定义D3树布局范围  
                    var inNodes = inTree.nodes(relaInRoot);   //获取所有节点信息  返回的为一个数组
                    var inNodes = outTree.nodes(relaOutRoot);
                }
                var dataNodesOut = []; // 用于存放右边树
                var dataNodes = [];  // 用于存放最终树数据（左边）
                var temp = {};
                // 树左边数据
                if(inNodes){
                    for(var i in inNodes){
                        temp = {};
                        if(inNodes[i].typeName){
                            temp.typeName = inNodes[i].typeName;
                        }else{
                            // 
                        }
                        if(inNodes[i].guid){
                            temp.name = inNodes[i].guid;
                        }else{
                            //
                        }
                        if(inNodes[i].displayText){
                            temp.displayText = inNodes[i].displayText;
                        }else{
                            // 
                        }
                        /* if(inNodes[i].pId){
                            temp.pId = inNodes[i].pId;
                        }else{
                            //
                        } */
                        /*  包含process为设置  */
                        if(inNodes[i].typeName.indexOf('process') < 0){
                            inNodes[i].symbol = 'image://assets/images/biaoge.png'
                        }else{
                            inNodes[i].symbol = 'image://assets/images/shezhi.png'
                        }
                        inNodes[0].symbol = 'image://assets/images/gen.png'  // 跟节点样式图片
                        temp.nodesType = 'in';
                        temp.symbol = inNodes[i].symbol;
                        temp.x = -inNodes[i].y;
                        temp.y = inNodes[i].x;
                        dataNodes.push(temp);
                    }
                }
                // 树右边数据
                // if(outNodes){
                //     for(var j in outNodes){
                //         temp = {};
                //         if(outNodes[j].typeName){
                //             temp.typeName = outNodes[j].typeName;
                //         }else{
                //             // 
                //         }
                //         if(outNodes[j].guid){
                //             temp.name = outNodes[j].guid;
                //         }else{
                //             //
                //         }
                //         if(outNodes[j].displayText){
                //             temp.displayText = outNodes[j].displayText;
                //         }else{
                //             // 
                //         }
                //         /* if(outNodes[j].pId){
                //             temp.pId = outNodes[j].pId;
                //         }else{
                //             //
                //         } */
                //         if(outNodes[j].typeName.indexOf('process') < 0){
                //             outNodes[j].symbol = 'image://assets/images/biaoge.png'
                //         }else{
                //             outNodes[j].symbol = 'image://assets/images/shezhi.png'
                //         }
                //         outNodes[0].symbol = 'image://assets/images/gen.png'  // 跟节点样式图片
                //         temp.symbol = outNodes[j].symbol;
                //         temp.x = outNodes[j].y;
                //         temp.y = outNodes[j].x;
                //         temp.nodesType = 'out';
                //         if(temp.name != dataNodes[0].name){
                //             dataNodes.push(temp);
                //         }
                //     }
                // }

                // 右边的树单独分开
                dataNodes[0].nodesType = 'mid';
                $scope.relativeOption1.series[0].data = dataNodes;
                $scope.relativeOption1.series[0].links = data.returnObject.points;
            } else if(data.returnCode == '0'){
                $scope.relativeOption1.series[0].data = [];
                $scope.relativeOption1.series[0].links = [];
				toastr.error('该表暂未记录上游血缘关系');
            }else if(data.returnCode == overTimeCode) {	
				$state.go('login');
			} 
		});
    }
        // 获取下游血缘关系函数
    $scope.getdownBlockRela = function(index){
        $scope.tabShow = index;
        var param = {
            guid: $rootScope.guId
        }
        var relaInRoot = {};  // 用于存放树左边数据
        var relaOutRoot = {};   // 用于存放树右边数据
        ngResource.Add('psdon-web/lineage/qry-output',{}, param).then(function(data) {
            if(data.returnCode == '1') {
                if(data.returnObject.outNodes == null){
                    relaInRoot = angular.copy(data.returnObject.outNodes);
                    //定义D3树布局范围  
                    var inTree = d3.layout.tree().size([400, 400]);
                    var outNodes = inTree.nodes(relaInRoot);   //获取所有节点信息  返回的为一个数组
                }else if(data.returnObject.outNodes != null){
                    relaInRoot = angular.copy(data.returnObject.outNodes);
                    relaOutRoot = angular.copy(data.returnObject.outNodes);
                    // 定义D3树布局范围  
                    var inTree = d3.layout.tree().size([400, 400]);
                    var outTree = d3.layout.tree().size([400, 400]);
                    // 定义D3树布局范围  
                    var outNodes = inTree.nodes(relaInRoot);   //获取所有节点信息  返回的为一个数组
                    var outNodes = outTree.nodes(relaOutRoot);
                }
                var dataNodesOut = []; // 用于存放右边树
                var dataNodes = [];  // 用于存放最终树数据（左边）
                var temp = {};
            
                // 右边的树单独分开
                if(outNodes){
                    for(var j in outNodes){
                        temp = {};
                        if(outNodes[j].typeName){
                            temp.typeName = outNodes[j].typeName;
                        }else{
                            // 
                        }
                        if(outNodes[j].guid){
                            temp.name = outNodes[j].guid;
                        }else{
                            //
                        }
                        if(outNodes[j].displayText){
                            temp.displayText = outNodes[j].displayText;
                        }else{
                            // 
                        }
                        /* if(outNodes[j].pId){
                            temp.pId = outNodes[j].pId;
                        }else{
                            //
                        } */
                        if(outNodes[j].typeName.indexOf('process') < 0){
                            outNodes[j].symbol = 'image://assets/images/biaoge.png'
                        }else{
                            outNodes[j].symbol = 'image://assets/images/shezhi.png'
                        }
                        outNodes[0].symbol = 'image://assets/images/gen.png'  // 跟节点样式图片
                        temp.symbol = outNodes[j].symbol;
                        temp.x = outNodes[j].y;
                        temp.y = outNodes[j].x;
                        temp.nodesType = 'out';
                        dataNodesOut.push(temp);
                    }
                }
                console.log(dataNodes)
                // dataNodes[0].nodesType = 'mid';
                $scope.relativeOption2.series[0].data = dataNodesOut;
                $scope.relativeOption2.series[0].links = data.returnObject.points;
            } else if(data.returnCode == '0'){
                $scope.relativeOption2.series[0].data = [];
                $scope.relativeOption2.series[0].links = [];
                toastr.error('该表暂未记录下游血缘关系');
            }else if(data.returnCode == overTimeCode) {	
                $state.go('login');
            } 
        });
    }    
    $scope.relationConfig1 = {
		theme: 'macarons',
		dataLoaded: true,
	};
	$scope.relativeOption1 = {
		title: {
            text: ''
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series : [  
            {
                type: 'graph',
                layout: 'none',
                symbolSize: 36,
                roam: true,
                label: {
                    normal: {
                        formatter: function(params){
                            var label
                            if(params.data.displayText){
                                if(params.data.displayText.length>10){
                                    label = params.data.displayText.substring(0,10)+'...'
                                }else{
                                    label = params.data.displayText;
                                }
                                return label;
                            }else{
                                return '';
                            }
                        },
                        color: 'gray',
                        show: true,
                        position: 'top', 
                        distance: 10,
                        width: 20
                    }
                },
                tooltip:{
                    formatter:function(params){
                        var tooltip;
                        if(params.data.displayText){
                            var text = params.data.displayText;
                            if(text.length>30){
                                text=text.replace(/[^\x00-\xff]/g,"$&\x01").replace(/.{30}\x01?/g,"$&<br/>").replace(/\x01/g,"");
                            }
                            if(params.data.nodesType == 'in'){
                                tooltip = '<div style="text-align: center">'+'Lineage'+'<br/>'+'<div style="color: #37bb98">'+ text +'</div>'+ '<br/>'+'('+params.data.typeName+')'+'</div>';
                                return tooltip
                            }else if(params.data.nodesType == 'out'){
                                tooltip = '<div style="text-align: center">'+'Impact'+'<br/>'+'<div style="color: #37bb98">'+ text +'</div>'+ '<br/>'+'('+params.data.typeName+')'+'</div>';
                                return tooltip
                            }else if(params.data.nodesType == 'mid'){
                                tooltip = '<div style="text-align: center">'+'<br/>'+'<div style="color: #37bb98">'+ text +'</div>'+ '<br/>'+'('+params.data.typeName+')'+'</div>';
                                return tooltip
                            }
                        }
                    }
                },
                edgeSymbol: ['none','arrow'],
                edgeSymbolSize: [4, 8],
                data: [],
                links: [],
                lineStyle: {
                    normal: {
                        opacity: 0.8,
                        width: 1,
                        curveness: 0,
                        color: '#8dc255'
                    }
                }
            }
        ]
    };
    $scope.relationConfig2 = {
		theme: 'macarons',
		dataLoaded: true,
	};
	$scope.relativeOption2 = {
		title: {
            text: ''
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series : [  
            {
                type: 'graph',
                layout: 'none',
                symbolSize: 36,
                roam: true,
                label: {
                    normal: {
                        formatter: function(params){
                            var label
                            if(params.data.displayText){
                                if(params.data.displayText.length>10){
                                    label = params.data.displayText.substring(0,10)+'...'
                                }else{
                                    label = params.data.displayText;
                                }
                                return label;
                            }else{
                                return '';
                            }
                        },
                        color: 'gray',
                        show: true,
                        position: 'top', 
                        distance: 10,
                        width: 20
                    }
                },
                tooltip:{
                    formatter:function(params){
                        var tooltip;
                        if(params.data.displayText){
                            var text = params.data.displayText;
                            if(text.length>30){
                                text=text.replace(/[^\x00-\xff]/g,"$&\x01").replace(/.{30}\x01?/g,"$&<br/>").replace(/\x01/g,"");
                            }
                            if(params.data.nodesType == 'in'){
                                tooltip = '<div style="text-align: center">'+'Lineage'+'<br/>'+'<div style="color: #37bb98">'+ text +'</div>'+ '<br/>'+'('+params.data.typeName+')'+'</div>';
                                return tooltip
                            }else if(params.data.nodesType == 'out'){
                                tooltip = '<div style="text-align: center">'+'Impact'+'<br/>'+'<div style="color: #37bb98">'+ text +'</div>'+ '<br/>'+'('+params.data.typeName+')'+'</div>';
                                return tooltip
                            }else if(params.data.nodesType == 'mid'){
                                tooltip = '<div style="text-align: center">'+'<br/>'+'<div style="color: #37bb98">'+ text +'</div>'+ '<br/>'+'('+params.data.typeName+')'+'</div>';
                                return tooltip
                            }
                        }
                    }
                },
                edgeSymbol: ['none','arrow'],
                edgeSymbolSize: [4, 8],
                data: [],
                links: [],
                lineStyle: {
                    normal: {
                        opacity: 0.8,
                        width: 1,
                        curveness: 0,
                        color: '#8dc255'
                    }
                }
            }
        ]
    };
    
    // 基本信息
    $scope.tableDetails = []
    $scope.getTableDetail = function(index){
        $scope.tabShow = index;
        $scope.tableParams = new NgTableParams({
            page: 1,
            count: 10,
            sorting: {}
        }, {
            counts: [],
            // total: tableData.length,  // 当tableDte为静态数据时使用
            getData: function($defer, params) {
                var param = {
                    guid: $rootScope.guId
                }
                ngResource.Query('psdon-web/lineage/getTabDetails', param).then(function(data) {
                    if(data.returnCode == '1') {
                        $scope.tableDetails = angular.copy(data.returnObject)
                    } else if(data.returnCode == overTimeCode) {
                        
                    }else if(data.returnCode == '0'){
                        toastr.error(data.returnMassage);
                    }
                });
            }
        });
    }

     // 数据预览
     $scope.prePgOne = true;
     $scope.prePgTwo = false;
     $scope.prePgThere = false;
     $scope.prePgFour = false;
     $scope.prePgFive = false;
     $scope.getTablePreview = function(index){
        $scope.tabShow = index;
        $scope.tableInfoPreview = '';
        $scope.tableInfoList = '';
        $scope.tableParams = new NgTableParams({
            page: 1,
            count: 10,
            sorting: {}
        }, {
            counts: [],
            // total: tableData.length,  // 当tableDte为静态数据时使用
            getData: function($defer, params) {
                var param = {
                    dbName: $rootScope.dbName,
                    tbName: $rootScope.tbName
                }
                ngResource.Query('psdon-web/lineage/getPreview', param).then(function(data) {
                    if(data.returnCode == '1') {
                        $scope.tableInfoPreview = angular.copy(data.returnObject.data)
                        $scope.tableInfoList = angular.copy(data.returnObject.column)
                        if(data.returnObject.data.length < 1){
                            toastr.error('该表没有预览数据');
                        }
                        $scope.coltotal = data.returnObject.data.length;
                    } else if(data.returnCode == overTimeCode) {
                        
                    }else if(data.returnCode == '0'){
                        toastr.error(data.returnMassage);
                    }
                });
            }
        });
     };

});