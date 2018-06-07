'use strict';
/*
 * auth 杨丽娟
 * date 2018-01-05
 * description 查看评估报表
 */
App.controller('echartNetCtrl', function($rootScope, $state, $scope, ngDialog, ngResource, toastr) {

  console.log($scope.netData.rowsCount);
  
 
	$scope.netConfig = {
		theme: 'macarons',
		dataLoaded: true
	};
	$scope.netOption = {
    tooltip : {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%"
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series : [
        {
            type: 'pie',
            radius : '65%',
            center: ['50%', '50%'],
            data:$scope.netData.ratio,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
	};
});