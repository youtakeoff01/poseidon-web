//服务器地址
//var base_url = 'http://10.211.55.246:8087/';
//测试环境
//var base_url = 'http://10.7.4.185:9999/';
//本地
var base_url = 'http://10.211.54.201:8080/';

var sucessCode = '000000';

var overTimeCode = '2';

//界面的权限限制
/*控制台*/
var consoleCode='1007';

/*数据集成*/
var IntegraCode = '1001';
/*数据源管理*/
var dataSourceCode = '10011';
/*数据同步*/
var dataSyncCode = '10012';

/*数据管理*/
var datamanagerCode = '1002';
/*权限设置*/
var permissionCode = '10021';
/*表管理*/
var tableCode = '10022';
/*云文件管理*/
var fileCode = '10023';
/* 云文件上传 */
var fileUploadCode = '100231';
/* 云文件夹创建 */
var fileCreatCode = '100232';
/* 云文件重命名 */
var fileRenameCode = '100233';
/* 云文件删除 */
var fileDelCode = '100234';
/* 云文件下载 */
var fileDoldCode = '100235';
/* 云文件移动 */
var fileMoveCode = '100236';

/*平台管理*/
var platformCode = '1003';
/*系统日志*/
var syLogCode = '10031';
/*系统设置*/
var sySetCode = '10032';
/*用户管理*/
var userCode = '10033';
/*用户组管理*/
var groupCode = '10034';
/*  流程管理 */
var processCode = '10035';
	/* 我的申请 */
var myapplyCode = '100351';
	/* 我的审批 */
var myapproval = '100352';

/*运维中心*/
var centerCode = '1004';
/*通知渠道*/
var noticeCode = '10041';
/*自定义通知*/
var customCode = '10042';
/*任务管理*/
var taskCode = '10043';
/*任务情况*/
var caseCode = '10044';
/* 规则管理 */
var ruleCode = '10045';

/*数据开发*/
var developCode = '1005';
/*数据加工*/
var searchCode = '10051';
/* 提交任务 */
var tasksubmitCode = '10052';

/*人工智能*/
var artiCode = '1006';
/*机器学习*/
var machineCode = '10061';
/*文本分析*/
var analysisCode = '10062';
/*深度学习*/
var depthCode = '10063';


var sexType = [{
		id: 1,
		desc: '男'
	},
	{
		id: 2,
		desc: '女'
	}
];
var roleType = [{
		id: 1,
		desc: '超级管理员'
	},
	{
		id: 2,
		desc: '普通管理员'
	},
	{
		id: 3,
		desc: '普通员工'
	}
];
/*实用工具类*/
var Utils = {};
var isEmpty = function(item) {
	if(angular.isUndefined(item) || item.length <= 0) {
		return true;
	} else {
		return false;
	}
}

/*
 * 用于处理UI-select赋值的问题
 * selectList 下拉框的列表值
 * id 被编辑的对象关于该下拉框的值
 */
var handleUiSelected = function(selectList, id) {
	for(var i = 0; i < selectList.length; i++) {
		if(selectList[i].id == id) {
			return selectList[i];
		}
	}
};
/*
 * 取一个对象的key和value
 * 返回：[ [key,value],[key,value],[key,value] ]
 */
var getObjectKey = function(obj) {
	var temp = [];
	for(var i in obj) {
		temp.push([i, obj[i]]);
	}
	return temp;
}

//权限的遍历
function contains(arr, obj) {
	var i = arr.length;
	while(i--) {
		if(arr[i] == obj) {
			return obj;
		}
	}
	
	return false;
}

function  menuTabsList(arr,obj) {
	var i = arr.length;
    while(i--) {
		if(arr[i].name == obj) {
			arr[i].active=true;
            return obj;
        }else{
			arr[i].active=false;
        }
    }
    return false;
}

function changeList(obj, index) {
	if(index == false) {
		obj = '0';
	} else {
		obj = obj;
	}
	return obj;
}
