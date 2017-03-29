(function(window){
    window.Ajax = {
        get: function (url,fn,fnf){
            var obj=new XMLHttpRequest();  // XMLHttpRequest对象用于在后台与服务器交换数据          
            obj.open('GET',url,true);
            obj.onreadystatechange = function(){
                if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) { // readyState==4说明请求已完成
                    fn.call(this, obj.responseText);  //从服务器获得数据
                }else if(obj.readyState == 4){
                    fnf.call(this, { data: '服务端错误!'})
                }
            };
            obj.onerror = function(){
                fnf.call(this, { data: '服务端错误!'})
            }
            obj.send(null);
        },
        post: function (url, data, fn) {
            var obj = new XMLHttpRequest();
            obj.open("POST", url, true);
            obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // 发送信息至服务器时内容编码类型
            obj.onreadystatechange = function () {
                if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {  // 304未修改
                    fn.call(this, obj.responseText);
                }else if(obj.readyState == 4){
                    fnf.call(this, { data: '服务端错误!'})
                }
            };
            obj.send(data);
        }
    }
})(window);

