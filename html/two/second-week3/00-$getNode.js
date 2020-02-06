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
