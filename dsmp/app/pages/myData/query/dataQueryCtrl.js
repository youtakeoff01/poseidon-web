'use strict';
/*
 * auth zhangtingting_
 * date 2017年5月3日 18:51:26
 * description 我的数据-数据加工
*/
App.controller('dataQueryCtrl',function($state,$scope,NgTableParams,ngDialog,ngResource,toastr){
	$scope.queryData=[];
	$scope.queryData=[
		{id:'1',empNo:'006',empName:'张婷婷6',emp:'员工',startDate:'2017-06-01',endDate:'2017-06-01'},
		{id:'2',empNo:'006',empName:'张婷婷6',emp:'员工',startDate:'2017-06-01',endDate:'2017-06-01'},
		{id:'3',empNo:'006',empName:'张婷婷6',emp:'员工',startDate:'2017-06-01',endDate:'2017-06-01'},
		{id:'4',empNo:'006',empName:'张婷婷6',emp:'员工',startDate:'2017-06-01',endDate:'2017-06-01'},
		{id:'5',empNo:'006',empName:'张婷婷6',emp:'员工',startDate:'2017-06-01',endDate:'2017-06-01'},
		{id:'6',empNo:'006',empName:'张婷婷6',emp:'员工',startDate:'2017-06-01',endDate:'2017-06-01'},
		{id:'7',empNo:'006',empName:'张婷婷6',emp:'员工',startDate:'2017-06-01',endDate:'2017-06-01'},
		{id:'8',empNo:'006',empName:'张婷婷6',emp:'员工',startDate:'2017-06-01',endDate:'2017-06-01'},
		{id:'9',empNo:'006',empName:'张婷婷6',emp:'员工',startDate:'2017-06-01',endDate:'2017-06-01'},
		{id:'10',empNo:'006',empName:'张婷婷6',emp:'员工',startDate:'2017-06-01',endDate:'2017-06-01'},
		{id:'11',empNo:'006',empName:'张婷婷6',emp:'员工',startDate:'2017-06-01',endDate:'2017-06-01'},
		{id:'12',empNo:'006',empName:'张婷婷7',emp:'员工',startDate:'2017-06-01',endDate:'2017-06-01'}
	];
	
	$scope.tableParams = new NgTableParams(
        {page:1,count:5,sorting:{}},
        {counts:[],total: $scope.queryData.length,getData: function($defer, params) {
            var param = {
            	'pageNo':params.page(),
            	'pageSize':params.count()
            };
            
            params.total(30);
            $defer.resolve($scope.queryData);
        }}
    );
  
    /*删除数据*/
	$scope.deleteQuery = function(id){
		$scope.dialogTitle = "提示";
		$scope.dialogMessage = "确定删除该数据?";
		ngDialog.open({
			scope:$scope,
			width:400,
			template: 'app/pages/common/warning.html'
		});
	};
	/*编辑数据*/
	$scope.editDataQuery =function(){
		$scope.dialogTitle = "编辑";
		ngDialog.open({
			scope:$scope,
			width:600,
			template: 'app/pages/myData/query/editDataQuery.html'
		});
	};
});