

let $ = {};

const $$ = (function(){
    var ajax = function(url,type,callback){
        var xhr = new  XMLHttpRequest();  // 1. 新建请求头 
        xhr.open(type,url,true);  // 2. 打开请求头 配置请求头信息
        xhr.send();   // 3. 发送请求
        xhr.onreadystatechange = function(){   // 4. 本地异步监听  返回的数据和结果  
            if(xhr.readyState==4&&xhr.status==200){
                callback(JSON.parse(xhr.responseText));
            }
        }
    }

    return {
        http:ajax
    }
})();

// const $$ = {
//     http:ajax
// }

export default $$;