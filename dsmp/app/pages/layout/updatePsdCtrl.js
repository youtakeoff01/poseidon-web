'use strict';
/*
 * auth 杨丽娟
 * date 2017-09-25
 * description 修改密码
 */

App.controller('updatePsdCtrl', function ($state, $scope, ngDialog, ngResource, toastr) {
    $scope.userData=[];
    //点击确定
    $scope.ok = function () {
        if ($scope.userData.updatePsd == $scope.userData.reUpdatePsd) {
            var param = {
                'password': $scope.userData.oldPsd,
                'newPassword': $scope.userData.updatePsd
            }
            ngResource.Query('psdon-web/loginController/changePassword', param).then(function(data) {
                if (data.returnCode == '1') {

                    toastr.success('修改成功');
                } else if (data.returnCode == overTimeCode) {
                    $state.go('login');
                } else {
                    toastr.error(data.returnMessage);
                }
                ngDialog.closeAll();
            });
        } else {
            toastr.error("两次密码输入不一致！");
        }
    }
});
