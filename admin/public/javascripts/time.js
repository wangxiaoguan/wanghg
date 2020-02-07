/**
 * Created by yaling.he on 2015/11/18.
 */
//鏃堕棿
function fn(){
    var time = new Date();
    var str= "";
    var div = document.getElementById("time");
	var hour = document.getElementById("hours");
//    console.log(time);
    var year = time.getFullYear();
    var mon = time.getMonth()+1;
    var day = time.getDate();
    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();
    var week = time.getDay();
    switch (week){
        case 0:week="星期天";
            break;
        case 1:week="星期一";
            break;
        case 2:week="星期二";
            break;
        case 3:week="星期三";
            break;
        case 4:week="星期四";
            break;
        case 5:week="星期五";
            break;
        case 6:week="星期六";
            break;
    }
    str = year +"年"+totwo(mon)+"月"+totwo(day)+"日"+"&nbsp;"+totwo(h)+":"+totwo(m)+":"+totwo(s)+"　"+week;
    div.innerHTML = str;
	if(h < 6){
		hour.innerHTML = "鍑屾櫒濂�";
	} else if(h < 12){
		hour.innerHTML = "涓婂崍濂�";
	} else if(h < 15){
		hour.innerHTML = "涓崍濂�";
	} else if(h < 18){
		hour.innerHTML = "涓嬪崍濂�";
	} else if(h < 21){
		hour.innerHTML = "鍌嶆櫄濂�";
	} else {
		hour.innerHTML = "娣卞濂�";
	}
}
fn();
setInterval(fn,1000);
function totwo(n){
    if(n<=9){
        return n = "0"+n;
    }
    else{
        return n =""+n;
    }
}
