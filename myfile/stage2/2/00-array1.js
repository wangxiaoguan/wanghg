var upperLetter =[];
var lowperLetter =[];
var number =[];
var sign=["_","$"];
for (i = 97; i <= 122; i++) {
    var letter = String.fromCharCode(i);
    lowperLetter[lowperLetter.length]=letter;
}
//alert(lowperLetter);
for (i = 65; i <= 90; i++) {
    var letter = String.fromCharCode(i);
    upperLetter[upperLetter.length]=letter;
}
// alert(upperLetter);
for (i = 48; i <= 57; i++) {
    var letter = String.fromCharCode(i);
    number[number.length]=letter;
}
//alert(number);
var lists=upperLetter.concat(lowperLetter,number,sign);//|A-Z|与|a-z|
var lists1=upperLetter.concat(lowperLetter,number);
//随机获取n个验证码
function getcode(n) {
    var iscode = "";
    for (i = 0; i < n; i++) {
        var code = lists1[Math.round(Math.random() * 61)];
        if (iscode.indexOf(code) == -1) {
            iscode = iscode + code;
        } else {
            i--;
        }

    }
    return iscode;
}
//把所有字母全部转换小写字母
function tolowper(str) {
    var str1 = "";
    for (var i = 0; i < str.length; i++) {
        if (57<str.charCodeAt(i)&&str.charCodeAt(i) < 97) {//通过编码判断字母是否在小写字母串(97-122)中还是在大写字母串中(65-90)
            var code = str.charCodeAt(i) + 32;//把小写字母的编码减去32变成小写字母对应大写字母的编码
            str1 = str1 + String.fromCharCode(code);//通过大写字母的编码获取某个大大写字母
        } else {
            str1 = str1 + str.charAt(i);
        }
    }
    return str1;
}