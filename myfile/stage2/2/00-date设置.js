function toNumber(num) {return num > 10 ? String(num) : "0" + num;}//时间十位化
function format(date, str) { //格式化时间的方法
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    return str.replace("yyyy", year).replace("mm", month).replace("dd", day).replace("hh", hour).replace("mm", min).replace("ss", sec);
} //格式化时间的方法