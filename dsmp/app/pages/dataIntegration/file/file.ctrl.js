/*
 * auth Lishanming_
 * date 2017年3月30日10:34:43
 * description 云文件
 */

'use strict'
App.controller('fileCtrl', function($state, $scope, ngDialog, ngResource, toastr, Uploader) {
	$scope.fileList = (window.sessionStorage.menuList); // 获取云文件权限
	$scope.fileList = $scope.fileList.split(',');
	if($scope.fileList.length>0){
		$scope.fileUploadCode = changeList(fileUploadCode, contains($scope.fileList, fileUploadCode));
		$scope.fileCreatCode = changeList(fileCreatCode, contains($scope.fileList, fileCreatCode));
		$scope.fileRenameCode = changeList(fileRenameCode, contains($scope.fileList, fileRenameCode));
		$scope.fileDelCode = changeList(fileDelCode, contains($scope.fileList, fileDelCode));
		$scope.fileDoldCode = changeList(fileDoldCode, contains($scope.fileList, fileDoldCode));
		$scope.fileMoveCode = changeList(fileMoveCode, contains($scope.fileList, fileMoveCode));
	}
	$scope.operation = true;  // 所有操作是否显示
	if($scope.fileRenameCode == 0 && $scope.fileDelCode == 0 && $scope.fileMoveCode == 0){
		$scope.operation = false;
	}
	$scope.isAddDir = false;
	$scope.currPath = ['全部文件'];
	$scope.showDelteBtn = false;  // 批量删除按钮先不显示

	$scope.selected = [];

	$scope.sortParam = {
		'name': 'desc',
		'size': 'desc',
		'time': 'desc',
	};
	$scope.sortBy = "name";

	$scope.sort = function(para) {
		if($scope.sortParam[para] == 'desc') {
			$scope.sortParam[para] = 'asc'
		} else {
			$scope.sortParam[para] = 'desc'
		}
		$scope.sortBy = para;
		//接着查询
	};

	$scope.files = [];

	//处理文件路径
	var handleSrc = function() {
		if($scope.currPath.length == 1) {
			return '';
		}
		var realSrc = "";
		for(var i = 1; i < $scope.currPath.length; i++) {

			realSrc = realSrc + $scope.currPath[i] + '/';
		}
		return realSrc;
	};

	// 获取文件夹内容
	$scope.getFiles = function() {
		ngResource.Query('psdon-web/InfoDocument/getPathTree', {
			'srcPath': handleSrc()
		}).then(function(data) {
			if(data.returnCode == '000000') {
				$scope.files = data.returnObject;
				$scope.selected = [];
				$scope.showDelteBtn = false;
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}
		});
	};
	$scope.getFiles();

	// 新建文件夹
	$scope.newDirectory = function(name) {

		ngResource.Add('psdon-web/InfoDocument/createDirectoy', {}, {
			'srcPath': handleSrc() +  name + '/'   
		}).then(function(data) {

			if(data.returnCode == '000000') {
				$scope.isAddDir = false;
				toastr.success(data.retMessage);
				$scope.getFiles();
			} else if(data.returnCode == '000007') {
				toastr.error(data.retMessage);
			} else if(data.returnCode == overTimeCode) {
				$state.go('login');
			}
		});
	};

	//查看下级文件
	$scope.goDeep = function(item) {
		if(item.directory == true) {
			$scope.currPath.push(item.name);
			$scope.getFiles();
		} else {
			return;
		}
	};
	var handleBatch = function() {
		var realValue = "";
		for(var i = 0; i < $scope.selected.length; i++) {
			if($scope.selected[i] == true) {
				realValue += $scope.files[i].srcPath + ',';
			}
		}
		return realValue;
	};

	// 删除文件或者文件夹
	$scope.deleteFile = function(item) {
		if(item == undefined) {
			//说明是批量删除
			$scope.fileDeleteSrcPath = handleBatch();
			if($scope.selected.length > 0) {
				$scope.dialogTitle = "提示";
				$scope.dialogMessage = "确定删除选中文件?";
				ngDialog.open({
					scope: $scope,
					width: 400,
					template: 'app/pages/common/warning.html',
					controller: function($scope, ngResource, ngDialog) {
						$scope.ok = function() {
							ngResource.Delete('psdon-web/InfoDocument/delete', {
								'srcPath': $scope.fileDeleteSrcPath
							}).then(function(data) {
								if(data.returnCode == sucessCode) {
									toastr.success('删除文件夹成功');
									$scope.fileDeleteSrcPath = "";
									// $scope.selected = [];
									// $scope.files = [];
									$scope.getFiles();
									ngDialog.closeAll();
								}
							});
						};
					}
				});
			} else {
				toastr.error('至少选中一条数据');
			}
		} else {
			// 非批量删除
			$scope.fileDeleteSrcPath = '/' + item.srcPath;
			$scope.dialogTitle = "提示";
			$scope.dialogMessage = "确定删除该文件?";
			ngDialog.open({
				scope: $scope,
				width: 400,
				template: 'app/pages/common/warning.html',
				controller: function($scope, ngResource, ngDialog) {
					$scope.ok = function() {
						ngResource.Delete('psdon-web/InfoDocument/delete', {
							'srcPath': $scope.fileDeleteSrcPath
						}).then(function(data) {
							if(data.returnCode == sucessCode) {
								toastr.success('删除文件夹成功');
								// $scope.selected = [];
								// $scope.files = [];
								$scope.getFiles();
								ngDialog.closeAll();
							}
						});
					};
				}
			});
		}
	};

	// 下载文件
	$scope.download = function(item) {
		window.open(base_url + 'psdon-web/InfoDocument/downloadFile?srcPath=' + item.srcPath + '&fileName=' + item.name);
	};

	// 上传文件
	$scope.fileSelected = function(file) {
		var des = handleSrc();
		var maxSize = false;
		var excFile = [];
		for(var i=0 ; i<file.files.length; i++){
			if(file.files[i].size>256*1024*1024){
				excFile.push(file.files[i].name);
				maxSize = true;
			}
		}
		if(maxSize){
			excFile = excFile.join('、')
			toastr.error(excFile+'文件超过256M');
		}else{
			Uploader.upload(base_url + 'psdon-web/InfoDocument/uploadFile', file.files, des).then(function(data) {
	
				if(data.data.returnCode == sucessCode){
					$scope.getFiles();
					var returnData = angular.copy(data.data.returnObject);
					var tipContent = [];  // 存放不成功提示
					var content;
					// 根据业务判断是否学生账号匹配或者是否同名
					for(var item in returnData){
						if(returnData[item].returnCode == '000009' || returnData[item].returnCode == '000008' || returnData[item].returnCode == '000007')	{
							$scope.dialogTitle = "提示";

							if(returnData[item].returnCode == '000009' || returnData[item].returnCode == '000008'){
								content = '文件名为:'+item+','+returnData[item].returnMessage ;
							}else if(returnData[item].returnCode == '000007'){
								content = item+returnData[item].returnMessage ;
							}

							tipContent.push(content);
						}else if(returnData[item].returnCode == sucessCode){
							toastr.success(item+'上传成功');
						}
					}
					if(tipContent.length>0){
						$scope.dialogMessage = tipContent.join(' <br/> ');
						ngDialog.open({
							scope: $scope,
							width: 400,
							template: 'app/pages/common/tip.html',
						}); 
					}
				}else if(data.data.returnCode == overTimeCode) {
					$state.go('login');
				}
				
			});
		}
	};
	
	//点击目录导航栏
	$scope.reFresh = function(index) {
		$scope.currPath.splice(index + 1, $scope.currPath.length - index - 1);
		//重新获取目录信息
		$scope.getFiles();
	};

	//移动文件
	$scope.moveTo = function(item, type) {

		$scope.operationType = type;

		$scope.fileMoveInfo = {
			'srcPath': item.srcPath,
			'name': item.name
		};
		$scope.dialogTitle = "移动到";
		ngDialog.open({
			scope: $scope,
			width: 500,
			template: 'app/pages/dataIntegration/file/moveFile.html',
			controller: 'moveFileCtrl'
		});
	};

	//重命名文件
	$scope.Rename = function(item) {

		$scope.RenameObject = angular.copy(item); //用做确定事件的处理中，注意使用深复制
		$scope.dialogTitle = "重命名";
		ngDialog.open({
			scope: $scope,
			width: 400,
			template: 'app/pages/dataIntegration/file/RenameFile.html',
			controller: 'RenameFileCtrl'
		});
	};

	/*当用户点击文件前面的复选框的时候，需要判断有没有选中文件，如果$scope.selected有true的情况，需要显示删除按钮*/
	$scope.checkSelected = function() {
		console.log($scope.selected)
		for(var i = 0; i < $scope.selected.length; i++) {
			if($scope.selected[i] == true) {
				$scope.showDelteBtn = true;
				return;
			}
		}
		$scope.showDelteBtn = false;
	};

	$scope.selectAll = function(isSelectAll) {
		console.log(isSelectAll)

		if(isSelectAll == true) {
			$scope.showDelteBtn = true; //处理选中文件后，出现删除按钮				
		} else {
			$scope.showDelteBtn = false;
		}

		for(var i = 0; i < $scope.files.length; i++) {
			if(isSelectAll == true) //全选
			{
				$scope.selected[i] = true;
			} else {
				$scope.selected[i] = false;
			}

		}
	};

});