/**
 * Created by hand on 2017/7/10.
 */
// 转换为字符串
 App.filter('StrToString', function () {
    return function (content) {
        var temp = content.toString();
        return temp;
    };
}); 

// 字符长度限制
App.filter('textLimit', function(){
    return function(val, num){
        if(!angular.isString(val)){
            return val;
        }
        var temp = val ;
        if(val.length>num){
           temp = val.substring(0, num)+"...";
        }
        return temp;
    }
})

//审批状态过滤器
App.filter('applyStatus', function(){
  return function(status){
    var applyText;
    switch(status){
      case 0 :
        applyText = '待审批';
        break;
      case 1 :
        applyText = '审批中';
        break;
      case 2 :
        applyText = '已审批';
        break;
      case 3 :
        applyText = '已拒绝';
        break;
      case 4 :
        applyText = '已失效';
        break;
      case 5 :
        applyText = '已过期';
        break;
    }
    return applyText;
  }
})