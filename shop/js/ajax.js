var sendurl= {
    ajax2: function (json) {
        var req = new XMLHttpRequest();
        if (json.data) { //难点取出对象的属性和值  处理url和data
            json.url += "?";
            for (var i in json.data) {
                json.url += i + "=" + json.data[i] + "&";
            }
            json.url = (json.url).substring(0, (json.url).length - 1);
        }
        req.open(json.type, json.url, true);
        req.send();
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                var result = req.responseText;
                if (json.fn) {
                    if (json.dataType == "json") {
                        result = JSON.parse(result);
                    }
                    json.fn(result);
                }
            }
        }
    },
    goLogin: function () {
        setCookie("loginurl", window.location.href, 7);
        //页面跳转以前   先记录当前页面的地址
        window.location.href = "Login.html";
    }
};
