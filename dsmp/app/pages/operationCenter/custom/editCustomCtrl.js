'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-23
 * description 通知渠道-新增
 */
App.controller('editCustomCtrl', function($state, $scope, NgTableParams, ngResource, toastr, ngDialog) {
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
	},{
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
		ngResource.Query('psdon-web/emailController/listEmails', param).then(function(data) {
			if(data.returnCode == '1') {
				$scope.noticeData = data.returnObject.mails;
				for(var j = 0; j < data.returnObject.mails.length; j++) {
					if(data.returnObject.mails[j].id == $scope.datetoBehind.mailChannelId) {
						$scope.datetoBehind.channelName = {
							'id': data.returnObject.mails[j].id,
							'channelName': data.returnObject.mails[j].channelName
						};

					}
				}
				// console.log($scope.datetoBehind.channelName);
			} else if(data.returnCode == overTimeCode) {
				setTimeout(function(){
					ngDialog.closeAll();
				},500)
				setTimeout(function(){
					$state.go('login');
				},1000)
			}

		});

	}


	$scope.ok = function() {

		if($scope.datetoBehind.triggerRule == undefined) {
			toastr.error('请填写必填项');
		} else {
			if($scope.datetoBehind.triggerRule.id == '1') {
				//数据使用率
				if($scope.datetoBehind.ruleName != "" && $scope.datetoBehind.triggerRule.name != "" &&
					$scope.datetoBehind.triggerCondition.name != "" && $scope.datetoBehind.ruleNum.name != "" &&
					$scope.datetoBehind.channelName.id != "" && $scope.datetoBehind.noticeContent != "") {

					var temp = '';
					if($scope.datetoBehind.triggerCondition.name == '大于等于') {
						temp = ">=";
					} else {
						temp = "<=";
					}

					var userParam = {
						"id":$scope.datetoBehind.id,
						"ruleName": $scope.datetoBehind.ruleName,
						"triggerRule": $scope.datetoBehind.triggerRule.name,
						"triggerCondition": temp,
						"ruleNum": $scope.datetoBehind.ruleNum.name,
						"mailChannelId": $scope.datetoBehind.channelName.id,
						"noticeContent": $scope.datetoBehind.noticeContent
					};
					updateData(userParam);

				} else {
					toastr.error('请填写必填项');
				}
			} else if($scope.datetoBehind.triggerRule.id == '2') {
				//集群状态
				if($scope.datetoBehind.ruleName != "" && $scope.datetoBehind.triggerRule.name != "" &&
					$scope.data.stateRuleNum.length > 0 && $scope.datetoBehind.channelName.id != "" &&
					$scope.datetoBehind.noticeContent != "") {

					var str = '';
					if($scope.data.stateRuleNum.length > 0) {
						for(var j = 0; j < $scope.data.stateRuleNum.length; j++) {
							if($scope.data.stateRuleNum.length - 1 == j) {
								str += $scope.data.stateRuleNum[j].name;
							} else {
								str += $scope.data.stateRuleNum[j].name + ';';
							}
						}
					}
					var stateParam = {
						"id":$scope.datetoBehind.id,
						"ruleName": $scope.datetoBehind.ruleName,
						"triggerRule": $scope.datetoBehind.triggerRule.name,
						"ruleNum": str,
						"mailChannelId": $scope.datetoBehind.channelName.id,
						"noticeContent": $scope.datetoBehind.noticeContent
					};
					updateData(stateParam);

				} else {
					toastr.error('请填写必填项');
				}

			} else if ($scope.datetoBehind.triggerRule.id == '3') {
                //集群状态
                if ($scope.datetoBehind.ruleName != undefined && $scope.datetoBehind.ruleName != "" &&
                    $scope.datetoBehind.triggerRule != undefined && $scope.datetoBehind.triggerRule.name != "" &&
                    $scope.datetoBehind.channelName != undefined && $scope.datetoBehind.channelName.id != "" &&
                    $scope.datetoBehind.noticeContent != undefined && $scope.datetoBehind.noticeContent != "") {

                        var stateParam = {
                            "id":$scope.datetoBehind.id,
                            "ruleName": $scope.datetoBehind.ruleName,
                            "triggerRule": $scope.datetoBehind.triggerRule.name,
                            "mailChannelId": $scope.datetoBehind.channelName.id,
                            "noticeContent": $scope.datetoBehind.noticeContent
                        };
                        updateData(stateParam);
                    }



            }
		}

	}

	function updateData(index) {
		ngResource.Update('psdon-web/noticeRuleController/updateNoticeRule', {}, index).then(function(data) {
			if(data.returnCode == '1') {

				toastr.success(data.returnMessage);
			} else if(data.returnCode == overTimeCode) {
				ngDialog.closeAll();
				$state.go('login');
			} else {
				toastr.error(data.returnMessage);
			}
			$scope.tableParams.reload();
			ngDialog.closeAll();
		});
	}

	function selectUpdateData() {

		//条件做判断
		if($scope.datetoBehind.triggerCondition == '>=') {
			$scope.datetoBehind.triggerCondition = {
				id: '1',
				name: '大于等于'
			}
		} else {
			$scope.datetoBehind.triggerCondition = {
				id: '2',
				name: '小于等于'
			}
		}
		//触发规则做判断
		if($scope.datetoBehind.triggerRule == '数据使用率') {
			$scope.datetoBehind.triggerRule = {
				id: '1',
				name: '数据使用率'
			}
		} else if($scope.datetoBehind.triggerRule == '集群状态'){
			$scope.datetoBehind.triggerRule = {
				id: '2',
				name: '集群状态'
			}
		}else if($scope.datetoBehind.triggerRule == '任务'){
            $scope.datetoBehind.triggerRule = {
                id: '3',
                name: '任务'
            }
        }
		//条件

		if($scope.datetoBehind.ruleNum == '10%') {
			$scope.datetoBehind.ruleNum = {
				id: '1',
				name: '10%'
			}
		} else if($scope.datetoBehind.ruleNum == '20%') {
			$scope.datetoBehind.ruleNum = {
				id: '2',
				name: '20%'
			}
		} else if($scope.datetoBehind.ruleNum == '30%') {
			$scope.datetoBehind.ruleNum = {
				id: '3',
				name: '30%'
			}
		} else if($scope.datetoBehind.ruleNum == '40%') {
			$scope.datetoBehind.ruleNum = {
				id: '4',
				name: '40%'
			}
		} else if($scope.datetoBehind.ruleNum == '50%') {
			$scope.datetoBehind.ruleNum = {
				id: '5',
				name: '50%'
			}
		} else if($scope.datetoBehind.ruleNum == '60%') {
			$scope.datetoBehind.ruleNum = {
				id: '6',
				name: '60%'
			}
		} else if($scope.datetoBehind.ruleNum == '70%') {
			$scope.datetoBehind.ruleNum = {
				id: '7',
				name: '70%'
			}
		} else if($scope.datetoBehind.ruleNum == '80%') {
			$scope.datetoBehind.ruleNum = {
				id: '8',
				name: '80%'
			}
		} else if($scope.datetoBehind.ruleNum == '90%') {
			$scope.datetoBehind.ruleNum = {
				id: '9',
				name: '90%'
			}
		} else if($scope.datetoBehind.ruleNum == '100%') {
			$scope.datetoBehind.ruleNum = {
				id: '10',
				name: '100%'
			}
		}

		if($scope.datetoBehind.ruleNum !== undefined && $scope.datetoBehind.ruleNum !== "" && $scope.datetoBehind.triggerRule.name == '集群状态') {
			$scope.data = {
				stateRuleNum: []
			};

			var arr = $scope.datetoBehind.ruleNum.split(";");
			for(var j = 0; j < arr.length; j++) {
				if(arr[j] == 'CRITICAL') {
					$scope.data.stateRuleNum.push({
						id: '1',
						name: 'CRITICAL'
					});
				}
				if(arr[j] == 'UNKNOWN') {
					$scope.data.stateRuleNum.push({
						id: '2',
						name: 'UNKNOWN'
					});
				}
				if(arr[j] == 'WARNING') {
					$scope.data.stateRuleNum.push({
						id: '3',
						name: 'WARNING'
					});
				}
			}

		}
	}
    selectUpdateData();
    searchEmails();
    // console.log("数据使用率规则值="+$scope.datetoBehind.ruleNum.name);
});