//大写字母,小写字母,数组,符号集合
function letterlists() {
    //A-Z:ASCII码表65-90
    //a-z:ASCII码表97-122
    //0-1:ASCII码表48-57
    var upperLetter = [];//大写字母
    var lowperLetter = [];//小写字母
    var number = [];//数组
    var sign = ["_", "$"];//特殊符号
    for (i = 97; i <= 122; i++) {
        var letter = String.fromCharCode(i);
        lowperLetter[lowperLetter.length] = letter;
    }
    for (i = 65; i <= 90; i++) {
        var letter = String.fromCharCode(i);
        upperLetter[upperLetter.length] = letter;
    }
    for (i = 48; i <= 57; i++) {
        var letter = String.fromCharCode(i);
        number[number.length] = letter;
    }
    var letterlists = upperLetter.concat(lowperLetter, number, sign);
    return letterlists;
}
