//从样内得到属性值兼容
function attribute(label,attr) {//label:元素节点  attr:属性名
    if (window.getComputedStyle){
        return  getComputedStyle(label)["attr"]
    }else { return label.currentStyle["attr"]}
}
//获取下一个节点兼容
function next(obj) {
    if (obj.nextElementSibling) {  return obj.nextElementSibling  }
    else { return obj.nextSibling  }
}
//获取上一个节点兼容
function pre(obj) {
    if (obj.previousElementSibling) { return obj.previousElementSibling }
    else {return obj.previousSibling}
}
//className兼容
function getbyClassName(classname) {
    if (window.getElementsByClassName){
        return document.getElementsByClassName(classname);
    }else {
        var nodelist=document.getElementsByTagName("*");//获得所有元素节点
        var nodes=[];
        for (var i=0;i<nodelist.length;i++) {
            var node=nodelist[i];
            if (node.className==classname) {
                nodes.push(node);
            }
        }
    }return nodes;
}
//获取COOKIE
function getCookie(key) {
    var cookies = document.cookie;
    if (cookies) {
        var cookieList = cookies.split("; ");//取出所有的cookie
        var value = "";
        cookieList.forEach(function (cookie) {
            var item = cookie.split("=");
            var itemKey = item[0];
            var itemValue = item[1];
            if (itemKey == key) {
                value = itemValue;
                return false;//终止里面函数的执行
            }
        });
        return value;
    } else {
        return "";
    }
}
//设置COOKIE
function setCookie(key, value, days) {
    var date = new Date();
    date.setDate(date.getDate() + days);
    document.cookie = key + "=" + value + ";expires=" + date;
}
//获取节点
function $(ele, parent) {   //ele=(#first  .middle  span)
    parent = parent || document;
    if (ele.indexOf(" ") != -1) { //有空格就表示有多个层级
        var list = ele.split(" ");//把所有的层都找出来 ?[".ul", ".middle", "span"]
        for (var i = 0; i < list.length; i++) {
            var item = list[i];//   // #first  .middle  span
            if (i == list.length - 1) {//处理最后一层
                return $(item, parent);
            } else {
                if (item.indexOf("#") == 0) {//爹是唯一的
                    parent = $(item, parent);//返回#first
                } else {
                    parent = $(item, parent)[0];//返回第一个.Middle
                }
            }
        }
    } else {
        //一层.#first /.Middle  /div
        var firstCode = ele.charAt(0);//找到第一个字符
        if (firstCode == "#") {
            return parent.getElementById(ele.substring(1));
        } else if (firstCode == ".") {
            return parent.getElementsByClassName(ele.substring(1));
        } else {
            return parent.getElementsByTagName(ele);
        }
    }
}
