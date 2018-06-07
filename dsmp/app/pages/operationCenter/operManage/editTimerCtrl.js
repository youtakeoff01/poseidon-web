'use strict';
/*
 * auth 杨丽娟
 * date 2017-05-23
 * description 运维中心-定时器的修改
 */
App.controller('editTimerCtrl', function ($state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
    // 获取邮件规则
    $scope.timetoBehind = [];
    
    if($scope.datetoBehind.timerAttribute!=null){
        $scope.timetoBehind.timeText=$scope.datetoBehind.timerAttribute;
    }
    // 定时器规则
    if($scope.timetoBehind.timeText){
        // 2、编辑修改定时器
        $scope.timetoBehind.timeTextEdit = $scope.timetoBehind.timeText.split(" ");
        // console.log($scope.timetoBehind.timeTextEdit);
        $scope.timetoBehind.min = $scope.timetoBehind.timeTextEdit[1];
        $scope.timetoBehind.houre = $scope.timetoBehind.timeTextEdit[2];
        $scope.timetoBehind.month = $scope.timetoBehind.timeTextEdit[4];
        $scope.timetoBehind.week = $scope.timetoBehind.timeTextEdit[5];
    }else{
        // 1、填写定时器
        $scope.timetoBehind.min = '*';
        $scope.timetoBehind.houre = '*';
        $scope.timetoBehind.month = '*';
        $scope.timetoBehind.week = '*';
    }
    // 取消定时器
    var timeTextFlag = false;
    $scope.disable = false;
    $scope.removeTimer = function(){
        timeTextFlag = true;
        $scope.disable = true;
        $scope.timetoBehind.min = '';
        $scope.timetoBehind.houre = '';
        $scope.timetoBehind.month = '';
        $scope.timetoBehind.week = '';
        $scope.timetoBehind.timeText = '';
        $scope.emailInfo = '1';
        $scope.timetoBehind.RuleName = undefined;
    };

    //是否邮件通知  默认为否
    $scope.timetoBehind.RuleName = undefined;
    $scope.changepart = function (index) {
        $scope.emailInfo = index;
        if(index == '0'){

        } else if(index == '1'){
            $scope.timetoBehind.RuleName = undefined;
        }
    }
    // 定时器判断函数（暂时先不用）
    function CronExpressionValidator() {  
    }  

    CronExpressionValidator.validateCronExpression = function(value) {  
        var results = true;  
        if (value == null || value.length == 0) {  
            return false;  
        }  

        // split and test length  
        var expressionArray = value.split(" ");  
        var len = expressionArray.length;  

        if ((len != 6) && (len != 7)) {  
            return false;  
        }
        
        if (expressionArray[3] != "?") {     
                return false;     
            } 

        // check only one question mark  
        var match = value.match(/\?/g);  
        if (match != null && match.length > 1) {  
            return false;  
        }  

        // check only one question mark  
        var dayOfTheMonthWildcard = "";  

        // if appropriate length test parts  
        // [0] Seconds 0-59 , - * /  
        if (CronExpressionValidator.isNotWildCard(expressionArray[0], /[\*]/gi)) {  
            if (!CronExpressionValidator.segmentValidator("([0-9\\\\,-\\/])", expressionArray[0], [0, 59], "seconds")) {  
                return false;  
            }  
        }  

        // [1] Minutes 0-59 , - * /  
        if (CronExpressionValidator.isNotWildCard(expressionArray[1], /[\*]/gi)) {  
            if (!CronExpressionValidator.segmentValidator("([0-9\\\\,-\\/])", expressionArray[1], [0, 59], "minutes")) {  
                return false;  
            }  
        }  

        // [2] Hours 0-23 , - * /  
        if (CronExpressionValidator.isNotWildCard(expressionArray[2], /[\*]/gi)) {  
            if (!CronExpressionValidator.segmentValidator("([0-9\\\\,-\\/])", expressionArray[2], [0, 23], "hours")) {  
                return false;  
            }  
        }  

        // [3] Day of month 1-31 , - * ? / L W C  
        if (CronExpressionValidator.isNotWildCard(expressionArray[3], /[\*\?]/gi)) {  
            if (!CronExpressionValidator.segmentValidator("([0-9LWC\\\\,-\\/])", expressionArray[3], [1, 31], "days of the month")) {  
                return false;  
            }  
        } else {  
            dayOfTheMonthWildcard = expressionArray[3];  
        }  

        // [4] Month 1-12 or JAN-DEC , - * /  
        if (CronExpressionValidator.isNotWildCard(expressionArray[4], /[\*]/gi)) {  
            expressionArray[4] = CronExpressionValidator.convertMonthsToInteger(expressionArray[4]);  
            if (!CronExpressionValidator.segmentValidator("([0-9\\\\,-\\/])", expressionArray[4], [1, 12], "months")) {  
                return false;  
            }  
        }  

        // [5] Day of week 1-7 or SUN-SAT , - * ? / L C #  
        if (CronExpressionValidator.isNotWildCard(expressionArray[5], /[\*\?]/gi)) {  
            expressionArray[5] = CronExpressionValidator.convertDaysToInteger(expressionArray[5]);  
            if (!CronExpressionValidator.segmentValidator("([0-9LC#\\\\,-\\/])", expressionArray[5], [1, 7], "days of the week")) {  
                return false;  
            }  
        } else {  
            if (dayOfTheMonthWildcard == String(expressionArray[5])) {  
                return false;  
            }  
        }  

        // [6] Year empty or 1970-2099 , - * /  
        if (len == 7) {  
            if (CronExpressionValidator.isNotWildCard(expressionArray[6], /[\*]/gi)) {  
                if (!CronExpressionValidator.segmentValidator("([0-9\\\\,-\\/])", expressionArray[6], [1970, 2099], "years")) {  
                    return false;  
                }  
            }  
        }  
        return true;  
    }  

    // ----------------------------------  
    // isNotWildcard 静态方法;  
    // ----------------------------------  
    CronExpressionValidator.isNotWildCard = function(value, expression) {  
        var match = value.match(expression);  
        return (match == null || match.length == 0) ? true : false;  
    }  

    // ----------------------------------  
    // convertDaysToInteger 静态方法;  
    // ----------------------------------  
    CronExpressionValidator.convertDaysToInteger = function(value) {  
        var v = value;  
        v = v.replace(/SUN/gi, "1");  
        v = v.replace(/MON/gi, "2");  
        v = v.replace(/TUE/gi, "3");  
        v = v.replace(/WED/gi, "4");  
        v = v.replace(/THU/gi, "5");  
        v = v.replace(/FRI/gi, "6");  
        v = v.replace(/SAT/gi, "7");  
        return v;  
    }  

    // ----------------------------------  
    // convertMonthsToInteger 静态方法;  
    // ----------------------------------  
    CronExpressionValidator.convertMonthsToInteger = function(value) {  
        var v = value;  
        v = v.replace(/JAN/gi, "1");  
        v = v.replace(/FEB/gi, "2");  
        v = v.replace(/MAR/gi, "3");  
        v = v.replace(/APR/gi, "4");  
        v = v.replace(/MAY/gi, "5");  
        v = v.replace(/JUN/gi, "6");  
        v = v.replace(/JUL/gi, "7");  
        v = v.replace(/AUG/gi, "8");  
        v = v.replace(/SEP/gi, "9");  
        v = v.replace(/OCT/gi, "10");  
        v = v.replace(/NOV/gi, "11");  
        v = v.replace(/DEC/gi, "12");  
        return v;  
    }  

    // ----------------------------------  
    // segmentValidator 静态方法;  
    // ----------------------------------  
    CronExpressionValidator.segmentValidator = function(expression, value, range, segmentName) {  
        var v = value;  
        var numbers = new Array();  

        // first, check for any improper segments  
        var reg = new RegExp(expression, "gi");  
        if (!reg.test(v)) {   
            return false;  
        }  

        // check duplicate types  
        // check only one L  
        var dupMatch = value.match(/L/gi);  
        if (dupMatch != null && dupMatch.length > 1) {  
            return false;  
        }  

        // look through the segments  
        // break up segments on ','  
        // check for special cases L,W,C,/,#,-  
        var split = v.split(",");  
        var i = -1;  
        var l = split.length;  
        var match;  

        while (++i < l) {  
            // set vars  
            var checkSegment = split[i];  
            var n;  
            var pattern = /(\w*)/;  
            match = pattern.exec(checkSegment);  

            // if just number  
            pattern = /(\w*)\-?\d+(\w*)/;  
            match = pattern.exec(checkSegment);  

            if (match  
                    && match[0] == checkSegment  
                    && checkSegment.indexOf("L") == -1  
                    && checkSegment.indexOf("l") == -1  
                    && checkSegment.indexOf("C") == -1  
                    && checkSegment.indexOf("c") == -1  
                    && checkSegment.indexOf("W") == -1  
                    && checkSegment.indexOf("w") == -1  
                    && checkSegment.indexOf("/") == -1  
                    && (checkSegment.indexOf("-") == -1 || checkSegment  
                            .indexOf("-") == 0) && checkSegment.indexOf("#") == -1) {  
                n = match[0];  

                if (n && !(isNaN(n)))  
                    numbers.push(n);  
                else if (match[0] == "0")  
                    numbers.push(n);  
                continue;  
            }  
            // includes L, C, or w  
            pattern = /(\w*)L|C|W(\w*)/i;  
            match = pattern.exec(checkSegment);  

            if (match  
                    && match[0] != ""  
                    && (checkSegment.indexOf("L") > -1  
                            || checkSegment.indexOf("l") > -1  
                            || checkSegment.indexOf("C") > -1  
                            || checkSegment.indexOf("c") > -1  
                            || checkSegment.indexOf("W") > -1 || checkSegment  
                            .indexOf("w") > -1)) {  

                // check just l or L  
                if (checkSegment == "L" || checkSegment == "l")  
                    continue;  
                pattern = /(\w*)\d+(l|c|w)?(\w*)/i;  
                match = pattern.exec(checkSegment);  

                // if something before or after  
                if (!match || match[0] != checkSegment) {   
                    continue;  
                }  

                // get the number  
                var numCheck = match[0];  
                numCheck = numCheck.replace(/(l|c|w)/ig, "");  

                n = Number(numCheck);  

                if (n && !(isNaN(n)))  
                    numbers.push(n);  
                else if (match[0] == "0")  
                    numbers.push(n);  
                continue;  
            }  

            var numberSplit;  

            // includes /  
            if (checkSegment.indexOf("/") > -1) {  
                // take first #  
                numberSplit = checkSegment.split("/");  

                if (numberSplit.length != 2) {   
                    continue;  
                } else {  
                    n = numberSplit[0];  

                    if (n && !(isNaN(n)))  
                        numbers.push(n);  
                    else if (numberSplit[0] == "0")  
                        numbers.push(n);  
                    continue;  
                }  
            }  

            // includes #  
            if (checkSegment.indexOf("#") > -1) {  
                // take first #  
                numberSplit = checkSegment.split("#");  

                if (numberSplit.length != 2) {    
                    continue;  
                } else {  
                    n = numberSplit[0];  

                    if (n && !(isNaN(n)))  
                        numbers.push(n);  
                    else if (numberSplit[0] == "0")  
                        numbers.push(n);  
                    continue; 
                } 
            }  

            // includes -  
            if (checkSegment.indexOf("-") > 0) {  
                // take both #  
                numberSplit = checkSegment.split("-");  

                if (numberSplit.length != 2) {   
                    continue;  
                } else if (Number(numberSplit[0]) > Number(numberSplit[1])) {  
                    continue;  
                } else {  
                    n = numberSplit[0];  

                    if (n && !(isNaN(n)))  
                        numbers.push(n);  
                    else if (numberSplit[0] == "0")  
                        numbers.push(n);  
                    n = numberSplit[1];  

                    if (n && !(isNaN(n)))  
                        numbers.push(n);  
                    else if (numberSplit[1] == "0")  
                        numbers.push(n);  
                    continue;  
                }  
            }  

        }  
        // lastly, check that all the found numbers are in range   	0 1 * ? * *
        i = -1;  
        l = numbers.length;  

        if (l == 0)  
            return false;  

        while (++i < l) {  
            // alert(numbers[i]);  
            if (numbers[i] < range[0] || numbers[i] > range[1]) {  
                return false;  
            }  
        }  
        return true;  
    }  
  
    $scope.ok = function () {
         //定时器格式判断
        /*  var timerFormat = false;
         function cronValidate(c) {
            var cron = c;
            var result = CronExpressionValidator.validateCronExpression(cron);
            if(result == true){
                timerFormat = true;
            }else{
                timerFormat = false;
            }
            return CronExpressionValidator.validateCronExpression(cron);  
        }  */
        // 定时器提交
        var  params ='';
        if(timeTextFlag){
            // 清空不需验证时间格式
            $scope.timetoBehind.timeText = '';
            if($scope.datetoBehind.taskType){
                // 分为提交任务和其他任务
                if($scope.datetoBehind.taskType == 'SQOOP'){
                    params = {
                        latestTaskEntity : {
                            'taskName': $scope.datetoBehind.taskName,
                            'taskType': $scope.datetoBehind.taskType,
                            'timerAttribute': $scope.timetoBehind.timeText,
                            'id':$scope.datetoBehind.id,
                            'emailStr':$scope.timetoBehind.RuleName,
                        }
                    }
                    ngResource.Update('psdon-web/tasksubmitcontroller/setSechdulerTask', {}, params).then(function (data) {
                        if(data.returnCode == '0'){
                            toastr.error(data.returnMessage);
                            ngDialog.closeAll();
                        }else if(data.returnCode == overTimeCode){
                            ngDialog.closeAll();
                            $state.go('login');
                        } else {
                            if (data.returnObject.returnCode == '1') {
                                $scope.tableParams.reload();
                                toastr.success('修改成功');
                                ngDialog.closeAll();
                            } 
                        }
                    });  
                }else{
                    params={
                        'timerAttribute': $scope.timetoBehind.timeText,
                        'id':$scope.datetoBehind.id,
                        'emailStr':$scope.timetoBehind.RuleName
                    }
                    ngResource.Update('psdon-web/TaskController/updateTask', {}, params).then(function (data) {
                        if (data.returnCode == '1') {
                            $scope.tableParams.reload();
                            toastr.success('修改成功');
                            ngDialog.closeAll();
                        } else if (data.returnCode == overTimeCode) {
                            ngDialog.closeAll();
                            $state.go('login');
                        } else {
                            toastr.error('修改失败');
                            ngDialog.closeAll();
                        }
                    });  
                }
            }
        }else{
            //编辑需验证时间格式
            $scope.timetoBehind.timeText = 0+' '+$scope.timetoBehind.min+' '+$scope.timetoBehind.houre+' '+'?'+' '+$scope.timetoBehind.month+' '+$scope.timetoBehind.week
            // cronValidate($scope.timetoBehind.timeText);
                if($scope.timetoBehind.min && $scope.timetoBehind.houre && $scope.timetoBehind.month && $scope.timetoBehind.week){
                    if($scope.datetoBehind.taskType == 'SQOOP'){
                        params = {
                            latestTaskEntity : {
                                'taskName': $scope.datetoBehind.taskName,
                                'taskType': $scope.datetoBehind.taskType,
                                'timerAttribute': $scope.timetoBehind.timeText,
                                'id':$scope.datetoBehind.id,
                                'emailStr':$scope.timetoBehind.RuleName,
                            }
                        }
                        ngResource.Update('psdon-web/tasksubmitcontroller/setSechdulerTask', {}, params).then(function (data) {
                            if(data.returnCode == '0'){
                                toastr.error(data.returnMessage);
                                ngDialog.closeAll();
                            }else if(data.returnCode == overTimeCode){
                                ngDialog.closeAll();
                                $state.go('login');
                            } else {
                                if (data.returnObject.returnCode == '1') {
                                    $scope.tableParams.reload();
                                    toastr.success('修改成功');
                                    ngDialog.closeAll();
                                } 
                            }
                        });  
                    }else{
                        params={
                            'timerAttribute': $scope.timetoBehind.timeText,
                            'id':$scope.datetoBehind.id,
                            'emailStr':$scope.timetoBehind.RuleName
                        }
                        ngResource.Update('psdon-web/TaskController/updateTask', {}, params).then(function (data) {
                            if (data.returnCode == '1') {
                                $scope.tableParams.reload();
                                toastr.success('修改成功');
                                ngDialog.closeAll();
                            } else if (data.returnCode == overTimeCode) {
                                ngDialog.closeAll();
                                $state.go('login');
                            } else {
                                toastr.error('修改失败');
                                ngDialog.closeAll();
                            }
                        });  
                    }
                } else {
                    toastr.error('请填写必填项');
                }
        }
    }
});
