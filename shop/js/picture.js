var timer=null;
var index2=0;
var before =index2;

start();

function start() {
    clearInterval(timer);
    timer = setInterval(function () {
        index2++;
        if (index2 ==5) {
            index2 = 0;
        }
        show1(false);
        before = index2;
    },3000);
}

$(".lunbo_nav li").hover(function () {
    index2=$(this).index();
    show1(true);
    clearInterval(timer);
    before=index2;
}, function () {
    start();
})


function show1(flag1) {
    $(".lunbo_nav li").eq(index2).addClass("selected").siblings().removeClass("selected");
    $(".lunbo_image li").eq(index2).addClass("selected").siblings().removeClass("selected");

    if(flag1){
        if(before>index2){
            $(".lunbo_image li").eq(before).stop().animate({"left": "-1900px"},1000);
            $(".lunbo_image li").eq(index2).css({"left": "1900px"}).stop().animate({"left": 0},1000);
        }else if(before<index2){
            $(".lunbo_image li").eq(before).stop().animate({"left": "1900px"},1000);
            $(".lunbo_image li").eq(index2).css({"left": "-1900px"}).stop().animate({"left": 0},1000);
        }
    }else{
        $(".lunbo_image li").eq(before).stop().animate({"left": "-1900px"},1000);
        $(".lunbo_image li").eq(index2).css({"left": "1900px"}).stop().animate({"left": 0},1000);
    }

}