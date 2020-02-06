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
function setCookie(key, value, days) {
    var date = new Date();
    date.setDate(date.getDate() + days);
    document.cookie = key + "=" + value + ";expires=" + date;
}