

const msg = "武汉1803 爱拼才赢....";

// module.exports = msg;



// 导出方式2  exports {     }    对象解构   数组解构   
exports.msg = msg;


exports.setCookies = function(value){
    console.log(value);
}