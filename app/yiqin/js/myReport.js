var myReportPage = 1,myReportAll = false,allReportPage = 1,allReportAll = false,sletype=0;

var isScrollStop = true;  //页面是否停止滚动 防止屏幕有滑动但还没到底部就开始加载数据
var isMoveDown = false;  //防止手指向上滑动屏幕开始加载数据
var isLoading = false;   //防止异步请求数据未返回到前端的时候重复提交请求
var isMoved = false;   //手指是否在滑动屏幕 防止出现手指触摸屏幕而没有滑动就加载数据
var startY = 0;

$(document).ready(function () {
    loginHtml();
    initdiv();
    // inittable();
    addmyData();
    addallData();
});

function loginHtml(){
    let parmas = paramsArr();
    $.ajax({
        url: `${IP}/gl_yqtj/manage/wx/investigators/wxLogin.json`,
        type: "post",
        dataType: "json",
        data:{code:parmas.code},
        async: false,
        success: function (res) {
            if(!res.success){
                if(res.rootType = 1){//1-跳转
                     window.location.href = res.root.replace(/{URL}/g,encodeURIComponent(IP+'/gl_yqtj/wx/home.html'));
                }else{//2-提示错误信息
                    alert(res.root)
                }
            }
        },
        error:function(error){
            console.log(error)
            // alert("未知错误")
        }
    });
}


function initdiv(){
    var $tab_li = $('.cat-tab .tab');
    $tab_li.click(function () {
        $(this).addClass('on').siblings().removeClass('on');
        var index = $tab_li.index(this);
        if(index===0){
            sletype = 0;
        }
        else{
            sletype = 1;
        }
        $('.list-box').eq(index).addClass("active").siblings().removeClass("active");
        $('.more a').eq(index).show().siblings().hide();
    });
    var todaylable = $("#today");
    todaylable.text(new Date().format('yyyy-MM-dd') +" 我的上报");

    $('.table').bind("scroll", srcollEvent);
    $('.table').bind("touchstart", startEvent).bind("touchmove", moveEvent).bind("touchcancel", stopEvent).bind("touchend", stopEvent);

    $(".sxdiv").click(function (){
        if($(".sleData").is(':hidden')){　
            $(".sleData").show();
            $("#allReport").show();
            $(".sxdiv").css('color','#2e61ca');
            $(".sxdiv").find('img').attr('src',"img/report/shaixuan_sel.png");
            $('#allReport').css("top", $('.table').eq(1).scrollTop());
            $('.table').unbind("touchstart").unbind("touchmove").unbind("touchcancel").unbind("touchend");
            $('.table').bind("touchmove",function(e){
                e.preventDefault();
            });
            // $('.table').bind("touchstart",startEvent).bind("touchmove", moveEvent).bind("touchcancel", stopEvent).bind("touchend", stopEvent);
        }
        else{
            $(".sleData").hide();
            $("#allReport").hide();
            $(".sxdiv").css('color','#000');
            $(".sxdiv").find('img').attr('src',"img/report/shaixuan.png");
            // $('.table').bind("scroll", srcollEvent);
            $('.table').unbind("touchmove");
            $('.table').bind("touchstart",startEvent).bind("touchmove", moveEvent).bind("touchcancel", stopEvent).bind("touchend", stopEvent);
        }
        // $(".sleData").show();
    });

    // $('.sleDatainput').find("input").blur(function(){
    //     var obj = $(this);
    //     if(!obj.val()){
    //         $(this).addClass('show_placeholder');
    //     }else{
    //         $(this).removeClass('show_placeholder');
    //     }
    // });
    // $('.sleDatainput').find("input").focus(function(){
    //     $(this).removeClass('show_placeholder');
    // });

    $("#cancle").click(function(){
        $("#startTime").val("");
        $("#endTime").val("");
    });
    $("#commit").click(function(){

        $(".sleData").hide();
        $('.table').unbind("touchmove");
        $('.table').bind("touchstart",startEvent).bind("touchmove", moveEvent).bind("touchcancel", stopEvent).bind("touchend", stopEvent);

        $(".sleData").hide();
        allReportPage=1;
        $('#allReportTable').empty();
        $('#allReportTable').append('<div id="allReport"></div>');
        addallData();
    });


    // $('row').click(function(e){
    //     alert(e.currenttaget.id);
    // });

    $("#keyword").change(function(){
        myReportPage=1;
        $('#myReportTable').empty();
        addmyData();
    });
    $("#allkeyword").change(function(){
        allReportPage=1;
        if($(".sleData").is(':hidden')){　
            $('#allReportTable').empty();
            $('#allReportTable').append('<div id="allReport"></div>');
            addallData();
        }
        else{
            return;
        }
    });
}



function addmyData(){
    var form = new FormData();
    if(myReportPage === 1){
        form.append("rows", "10");
    } else{
        if(myReportPage === 2){
            myReportPage++;
        }
        form.append("rows", "5");
    }
    form.append("page", myReportPage);
    form.append("keywords", $("#keyword").val());

    showAjaxLoading()

    $.ajax({
        url: `${IP}/gl_yqtj/manage/wx/investigators/queryPageToDayInvestigators.json`,
        type: "post",
        dataType: "json",
        data:form,
        processData: false,   // jQuery不要去处理发送的数据
        contentType: false,
        // async: true,
        success: function (info) {
            if(info.jsonModel && info.jsonModel.success)
            {
                inittable(info.jsonModel.root.rows,0);
                if(info.jsonModel.root.total === $("#myReportTable").children().length){
                    myReportAll = true;
                }
                else{
                    myReportAll = false;
                }
            }

            stopAjaxLoading()

        }
    });
}

function addallData(){
    var form = new FormData();
    if(allReportPage === 1){
        form.append("rows", "10");
    }
    else{
        if(allReportPage === 2){
            allReportPage++;
        }
        form.append("rows", "5");
    }
    form.append("page", allReportPage);
    form.append("keywords", $("#allkeyword").val());
    form.append("inputStartDate", $("#startTime").val());
    form.append("inputEndDate",$("#endTime").val());

    showAjaxLoading()

    $.ajax({
        url: `${IP}/gl_yqtj/manage/wx/investigators/queryPageAllInvestigators.json`,
        type: "post",
        dataType: "json",
        data:form,
        processData: false,   // jQuery不要去处理发送的数据
        contentType: false,
        // async: true,
        success: function (info) {
            if(info.jsonModel && info.jsonModel.success)
            {
                inittable(info.jsonModel.root.rows,1);
                if(info.jsonModel.root.total === ($("#allReportTable").children().length-1)){
                    allReportAll = true;
                }
                else{
                    allReportAll = false;
                }
            }

            stopAjaxLoading()
        }
    });
}

function windowre(id){
    // alert(id);
    window.location.href =`formDetail.html?personId=${id}`
}

function inittable(data,type){
    if(type===0){
        var todayreport = $('#myReportTable');
        var tr='';
        for(var i=0;i<data.length;i++){
            var tr=tr+
            '<row onClick="windowre(\''+data[i].id+'\')" dataId="'+data[i].id+'">'+
                '<div class="firstdiv">'+data[i].pname+'<img src="img/report/arrow.png"></img></div>'+
                '<div>身份证号：'+data[i].idcard+'</div>'+
                '<div>联系电话：'+data[i].phone+'</div>'+
            '</row>';
        }
        todayreport.append(tr);
    }
    else{
        var allreport = $('#allReport');
        var tr='';
        for(var i=0;i<data.length;i++){
            var tr=tr+
            '<row onClick="windowre(\''+data[i].id+'\')" dataId="'+data[i].id+'">'+
                '<div class="firstdiv">'+data[i].pname+'<img src="img/report/arrow.png"></img></div>'+
                '<div>身份证号：'+data[i].idcard+'</div>'+
                '<div>' +
                    '<div>联系电话：'+data[i].phone+'</div>'+
                    '<div  class="time"><img src="img/report/time.png"></img>'+data[i].inputDate+'</div>'+
               ' </div>'+
            '</row>';
        }
        allreport.before(tr);
    }
}

function srcollEvent() {

    function isBounce() {

        if (isAndroid()){
            return false
        }

        let rowHeight = $('#allReportTable').children("row:last").height()
        let containerSize = $('#allReportTable').height()
        let position = $('#allReportTable').children("row:last").position().top

        return position + rowHeight < containerSize
    }

    if (isBounce()) {
        isScrollStop = true
    }else {
        isScrollStop = false;
    }
}
function startEvent() {
    startY = event.targetTouches[0].clientY;
    isScrollStop = true;
    isMoved = false;
    isMoveDown = false;
}
function moveEvent() {
    var Y = event.targetTouches[0].clientY;
    if (startY > Y) {
        isMoveDown = true;
    } else {
        isMoveDown = false;
    }
    isMoved = true;
}
function stopEvent() {
    if(!$(".sleData").is(':hidden')){
        return;
    }
    if (isScrollStop && isMoved && !isLoading && isMoveDown) {
        console.log("分页加载");
        if(sletype ===0 && !myReportAll){
                myReportPage++;
                addmyData();
        }
        else if(sletype ===1 && !allReportAll){
            allReportPage++;
            addallData();
        }
    }
}


function showAjaxLoading(btn) {
    var opts = {
        lines: 18, // The number of lines to draw
        length: 10, // The length of each line
        width: 2, // The line thickness
        radius: 10, // The radius of the inner circle
        scale: 1, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        color: '#000', // CSS color or array of colors
        fadeColor: 'transparent', // CSS color or array of colors
        speed: 1, // Rounds per second
        rotate: 0, // The rotation offset
        animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
        direction: 1, // 1: clockwise, -1: counterclockwise
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        shadow: '0 0 1px transparent', // Box-shadow for the lines
        position: 'absolute' // Element positioning
    };
    $('#ajax_spin').remove();
    $('body').append('<div id="ajax_spin" style="position:absolute;background:#FFF;filter:alpha(opacity=30);opacity:0.3"><div id="ajax_spin_inner" style="position:relative;height:50px;top:40%"></div></div>');
    $('#ajax_spin').css({
        'position': 'fixed',
        'top': 0,
        'bottom': 0,
        'left': 0,
        'right': 0
    });
    var target = document.getElementById('ajax_spin_inner');
    var spinner = new Spinner(opts).spin(target);
    //return spinner;
}

function stopAjaxLoading() {
    $('#ajax_spin').remove();
    //new Spinner(opts).spin(target)
    //spinner.stop();
}
