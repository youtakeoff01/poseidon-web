'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-23
 * description 通知渠道-新增
 */
App.controller('addCustomCtrl', function ($state, $scope, NgTableParams, ngResource, toastr, ngDialog) {
    $scope.addCustomInfo = {};
    $scope.searchRuleName = function () {
        if ($scope.addCustomInfo.ruleName) {

            var tableNameData = {
                'ruleName': $scope.addCustomInfo.ruleName
            };
            ngResource.Query('psdon-web/noticeRuleController/listNoticeRuleAll', tableNameData).then(function (data) {
                $scope.submitCode = data.returnCode;
                if ($scope.submitCode == 1) {
                    toastr.error("该规则已经存在,不允许创建！");
                } else if (data.returnCode == overTimeCode) {
                    ngDialog.closeAll();
                    $state.go('login');
                }
            });
        }else{
            
        }
    }
    //对象
    $scope.data = {
        stateRuleNum: []
    };
    $scope.selectRule = [{
        id: '1',
        name: '数据使用率'
    }, {
        id: '2',
        name: '集群状态'
    }, {
        id: '3',
        name: '任务'
    }];
    $scope.selectData = [{
        id: '1',
        name: '大于等于'
    }, {
        id: '2',
        name: '小于等于'
    }];
    $scope.userData = [{
        id: '1',
        name: '10%'
    }, {
        id: '2',
        name: '20%'
    }, {
        id: '3',
        name: '30%'
    }, {
        id: '4',
        name: '40%'
    }, {
        id: '5',
        name: '50%'
    }, {
        id: '6',
        name: '60%'
    }, {
        id: '7',
        name: '70%'
    }, {
        id: '8',
        name: '80%'
    }, {
        id: '9',
        name: '90%'
    }, {
        id: '10',
        name: '100%'
    }];
    $scope.stateData = [{
        id: '1',
        name: 'CRITICAL'
    }, {
        id: '2',
        name: 'UNKNOWN'
    }, {
        id: '3',
        name: 'WARNING'
    }];

    //通知渠道的获取
    function searchEmails() {
        var param = {
            'startPage': 1,
            'count': 10
        };
        ngResource.Query('psdon-web/emailController/listEmails', param).then(function (data) {
            if (data.returnCode == '1') {
                $scope.noticeData = data.returnObject.mails;

            } else if (data.returnCode == overTimeCode) {
                setTimeout(function(){
                    ngDialog.closeAll();
                },500)
                setTimeout(function(){
                    $state.go('login');
                },1000)
            }

        });

    }

    searchEmails();

    $scope.ok = function () {

        if ($scope.addCustomInfo.triggerRule == undefined) {
            toastr.error('请填写必填项');
        } else {
            if ($scope.addCustomInfo.triggerRule.id == '1') {
                //数据使用率
                if ($scope.addCustomInfo.ruleName != undefined && $scope.addCustomInfo.ruleName != "" &&
                    $scope.addCustomInfo.triggerRule != undefined && $scope.addCustomInfo.triggerRule.name != "" &&
                    $scope.addCustomInfo.triggerCondition != undefined && $scope.addCustomInfo.triggerCondition.name != "" &&
                    $scope.addCustomInfo.ruleNum != undefined && $scope.addCustomInfo.ruleNum.name != "" &&
                    $scope.addCustomInfo.channelName != undefined && $scope.addCustomInfo.channelName.id != "" &&
                    $scope.addCustomInfo.noticeContent != undefined && $scope.addCustomInfo.noticeContent != "") {

                    var temp = '';
                    if ($scope.addCustomInfo.triggerCondition.name == '大于等于') {
                        temp = ">=";
                    } else {
                        temp = "<=";
                    }

                    if ($scope.submitCode != 0) {
                        // toastr.error("该规则已经存在,不允许新增！");
                    } else {
                        var userParam = {
                            "ruleName": $scope.addCustomInfo.ruleName,
                            "triggerRule": $scope.addCustomInfo.triggerRule.name,
                            "triggerCondition": temp,
                            "ruleNum": $scope.addCustomInfo.ruleNum.name,
                            "mailChannelId": $scope.addCustomInfo.channelName.id,
                            "noticeContent": $scope.addCustomInfo.noticeContent
                        };
                        updateData(userParam);
                    }
                } else {
                    toastr.error('请填写必填项');
                }
            } else if ($scope.addCustomInfo.triggerRule.id == '2') {
                //集群状态
                if ($scope.addCustomInfo.ruleName != undefined && $scope.addCustomInfo.ruleName != "" &&
                    $scope.addCustomInfo.triggerRule != undefined && $scope.addCustomInfo.triggerRule.name != "" &&
                    $scope.data.stateRuleNum.length > 0 &&
                    $scope.addCustomInfo.channelName != undefined && $scope.addCustomInfo.channelName.id != "" &&
                    $scope.addCustomInfo.noticeContent != undefined && $scope.addCustomInfo.noticeContent != "") {

                    var str = '';
                    if ($scope.data.stateRuleNum.length > 0) {
                        for (var j = 0; j < $scope.data.stateRuleNum.length; j++) {
                            if ($scope.data.stateRuleNum.length - 1 == j) {
                                str += $scope.data.stateRuleNum[j].name;
                            } else {
                                str += $scope.data.stateRuleNum[j].name + ';';
                            }

                        }
                    }

                    if ($scope.submitCode != 0) {
                        // toastr.error("该规则已经存在,不允许新增！");
                    } else {
                        var stateParam = {
                            "ruleName": $scope.addCustomInfo.ruleName,
                            "triggerRule": $scope.addCustomInfo.triggerRule.name,
                            "ruleNum": str,
                            "mailChannelId": $scope.addCustomInfo.channelName.id,
                            "noticeContent": $scope.addCustomInfo.noticeContent
                        };
                        updateData(stateParam);
                    }

                } else {
                    toastr.error('请填写必填项');
                }

            } else if ($scope.addCustomInfo.triggerRule.id == '3') {
                //集群状态
                if ($scope.addCustomInfo.ruleName != undefined && $scope.addCustomInfo.ruleName != "" &&
                    $scope.addCustomInfo.triggerRule != undefined && $scope.addCustomInfo.triggerRule.name != "" &&
                    $scope.addCustomInfo.channelName != undefined && $scope.addCustomInfo.channelName.id != "" &&
                    $scope.addCustomInfo.noticeContent != undefined && $scope.addCustomInfo.noticeContent != "") {

                    if ($scope.submitCode != 0) {
                         // toastr.error("该规则已经存在,不允许新增！");
                    } else {
                        var stateParam = {
                            "ruleName": $scope.addCustomInfo.ruleName,
                            "triggerRule": $scope.addCustomInfo.triggerRule.name,
                            "mailChannelId": $scope.addCustomInfo.channelName.id,
                            "noticeContent": $scope.addCustomInfo.noticeContent
                        };
                        updateData(stateParam);
                    }

                } else {
                    toastr.error('请填写必填项');
                }

            }
        }


    }

    function updateData(index) {
        ngResource.Add('psdon-web/noticeRuleController/insertNoticeRule', {}, index).then(function (data) {
            if (data.returnCode == '1') {
                toastr.success('新增成功');
            } else if (data.returnCode == overTimeCode) {
                ngDialog.closeAll();
                $state.go('login');
            } else {
                toastr.error(data.returnMessage);
            }
            $scope.selected=[];
            $scope.tableParams.reload();
            ngDialog.closeAll();
        });
    }

});