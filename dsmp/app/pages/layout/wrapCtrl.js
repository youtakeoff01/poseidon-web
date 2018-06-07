/**
 * Created by hand on 2017/10/13.
 */
'use strict';
/*
 * auth 杨丽娟
 * date 2017-08-09
 * description 右侧页面的切换
 */
App.controller('wrapCtrl', function ($rootScope, $timeout, $state, $scope, NgTableParams, ngDialog, ngResource, toastr) {
    $scope.newTabs = [];

    //计算界面可以展示多少标签
    var temp = $("#scroll-nav").width();
    $rootScope.menuNum = parseInt(temp / 122)-2;
    // console.log("界面可以显示多少个标签",$rootScope.menuNum);

    var leftIndex = 0;
    var rightIndex=0;
    var placeNum;  // 用于计数截取的开始位置

    $scope.leftFloat = function(){
        for(var i=0; i<$rootScope.menuTabs.length; i++){
            if($rootScope.menuTabs[i].name == $rootScope.scliceTabs[0].name){
                placeNum = i;
                break;
            }
        }
        placeNum--;
        if(placeNum>-1){
            if ($rootScope.menuTabs.length > $rootScope.menuNum) {
                $rootScope.scliceTabs = $rootScope.menuTabs.slice(placeNum, placeNum+$rootScope.menuNum);
                //  用来判断是否可以左移
                if($rootScope.scliceTabs[0].name == '控制台'){ 
                    $rootScope.leftMove = false;
                }
                // 用来判断是否还可以右移
                judgMentRtMove();
                for(var i=0; i<$rootScope.menuTabs.length; i++){
                    $rootScope.menuTabs[i].active = false;
                }
                $rootScope.menuTabs[placeNum+$rootScope.menuNum-1].active = true;
            } else {
                $rootScope.scliceTabs = $rootScope.menuTabs.slice(0, $rootScope.menuNum);
                // 用来判断是否还可以右移
                judgMentRtMove();
            }
        }
    } 

    $scope.rightFloat = function(){
        $rootScope.leftMove = true; 
        for(var i=0; i<$rootScope.menuTabs.length; i++){
            if($rootScope.menuTabs[i].name == $rootScope.scliceTabs[0].name){
                placeNum = i;
                break;
            }
        }
        placeNum++;
        if(placeNum<$rootScope.menuTabs.length-$rootScope.menuNum+1){
            if ($rootScope.menuTabs.length > $rootScope.menuNum) {
                $rootScope.scliceTabs = $rootScope.menuTabs.slice(placeNum, placeNum+$rootScope.menuNum);
                // 用来判断是否还可以右移
                judgMentRtMove();
                // 激活tab标签页的最后一个tab
                for(var i=0; i<$rootScope.menuTabs.length; i++){
                    $rootScope.menuTabs[i].active = false;
                }
                $rootScope.menuTabs[placeNum+$rootScope.menuNum-1].active = true;
            } else {
                $rootScope.scliceTabs = $rootScope.menuTabs.slice(0, $rootScope.menuNum);
                // 用来判断是否还可以右移
                judgMentRtMove();
            }
        }
    }

    // 用来判断是否可以右移函数
    var judgMentRtMove = function(){
        if($rootScope.scliceTabs[$rootScope.scliceTabs.length-1].name != $rootScope.menuTabs[$rootScope.menuTabs.length-1].name){
            $rootScope.rightMove = true;
        }else{
            $rootScope.rightMove = false;
        }
    }
    /* $scope.leftFloat = function () {
        console.log('已经有的标签页', $rootScope.menuTabs);
        console.log('tab标签页',$rootScope.scliceTabs);

        leftIndex++;
        var lengthStr = $rootScope.menuTabs.length;
        if (lengthStr > $rootScope.menuNum) {
            $rootScope.scliceTabs = $rootScope.menuTabs.slice(leftIndex, leftIndex + $rootScope.menuNum);
        } else {
            $rootScope.scliceTabs = $rootScope.menuTabs.slice(leftIndex, lengthStr);
        }
        for(var j=0; j<$rootScope.menuTabs.length; j++){
            if($rootScope.menuTabs[j].active = true){
                break;
            }else{
                $rootScope.menuTabs[$rootScope.menuTabs.length-1].active = true;
            }
        }
        console.log("tab标签页=",$rootScope.scliceTabs);
    }  */
    /*  $scope.leftFloat = function(){
        leftIndex++;
        var lengthStr = $rootScope.menuTabs.length;
        if (lengthStr > $rootScope.menuNum) {

            // $rootScope.scliceTabs = $rootScope.menuTabs.slice(leftIndex, leftIndex + $rootScope.menuNum);
            console.log($rootScope.scliceTabs);
            for(var i=0; i<$rootScope.scliceTabs.length; i++){
                $rootScope.scliceTabs[i].hide = false;
            }
            $rootScope.scliceTabs[$rootScope.scliceTabs.length-1].hide = true;
        } else {
            // $rootScope.scliceTabs = $rootScope.menuTabs.slice(leftIndex, lengthStr);
            console.log($rootScope.scliceTabs);
        }
    } */
    // 点击激活当前页
    $scope.changeActive = function (row) {
        for (var j = 0; j < $rootScope.menuTabs.length; j++) {
            if (row.name == $rootScope.menuTabs[j].name) {
                $rootScope.menuTabs[j].active = true;
            } else {
                $rootScope.menuTabs[j].active = false;
            }
        }
    }
    
    //关闭标签页
    $scope.closeTab = function (index, row) {
        // 获取当前激活页面  (不是由左侧点击的数据)
        var activePage;
        for (var j = 0; j < $rootScope.menuTabs.length; j++) {
            if ($rootScope.menuTabs[j].active == true) {
                activePage = j;
            } else {

            }
        }
        // 获取该删除的tab在菜单页中的位置，根据位置删除
        var place;   // 记录关闭页面在之前menu中的索引值
        for(var i=0; i<$rootScope.menuTabs.length; i++ ){
            if($rootScope.menuTabs[i].name == row.name){
                place = i;
                break;
            }
        }

        // 再进行删除
        $rootScope.scliceTabs.splice(index, 1);
        var str = $rootScope.menuTabs.indexOf(row);
        $rootScope.menuTabs.splice(str, 1);
        if( $rootScope.leftMove == true){
            $scope.leftFloat(); // 调用左点击按钮
        }else{
            $rootScope.scliceTabs = $rootScope.menuTabs.slice(0, $rootScope.menuNum); 
            // 用来判断是否还可以右移
            judgMentRtMove();
        }

        // 激活的和删除的页面是否相等
        if(place == activePage){
            // 激活页面为最后一个 且删除最后一个页面，则仍激活最后一个页面
            for (var j = 0; j < $rootScope.menuTabs.length; j++) {
                $rootScope.menuTabs[j].active = false;
                if (j == activePage-1) {
                    $rootScope.menuTabs[j].active = true;
                } 
            }
        }else{
           // 不相等时不变
        }
        index++;
    }
});