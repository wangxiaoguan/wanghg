/*****************************************表单校验以及默认值*****************************************************/ 

//日期默认值
let nowTime = moment(new Date()).format("YYYY-MM-DD");
console.log(nowTime)
$("#inputDate").attr("value",nowTime);


//姓名校验 ^[A-Za-z]+$
$("#pname").change(function(){
    let pname = $("#pname").val();
    let check = /^[\u4E00-\u9FA5]{2,4}$/.test(pname);
    let check2 = /^[A-Za-z]{1,14}$/.test(pname);
    if(check){
        $("#pnameCheck").html("")
    }else if(check2){
        $("#pnameCheck").html("")
    }else{
        $("#pnameCheck").html("请填写2~4字中文或者1~14个英文字母")
    }

})
//身份证校验
$("#idcard").change(function(){
    let idCardNo = $("#idcard").val();
    let otherStr = idCardNo.replace(/[0-9Xx]/ig,"")
    console.log(otherStr)
    let check = /^\d{15}$/.test(idCardNo)||/^\d{17}(\d|x|X)$/.test(idCardNo);
    let check2 = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(idCardNo);
    if(idCardNo.length===0){
        $("#idcardCheck").html("")
    }else if(otherStr){
        $("#idcardCheck").html("校验错误，身份证号由0-9、X、x组合")
    }else if(!check){
        $("#idcardCheck").html("校验错误，身份证号为15位或18位")  
    }else{
        let idCardNo18 = idCardNoUtil.getId18(idCardNo)
        let info = idCardNoUtil.getIdCardInfo(idCardNo18)
        if(!checkProv(idCardNo18.substring(0,2))){
            $("#idcardCheck").html("身份证号地址码错误")
        }else if(!checkDate(info.birthday)){
            $("#idcardCheck").html("身份证号出生日期码错误")
        }else if(!checkCode(idCardNo18)){
            $("#idcardCheck").html("身份证号校验码错误")
        }else{
            $("#psex").val(info.gender)
            $("#idcardCheck").html("")
        }
    }
});
//联系电话校验
$("#phone").change(function(){
    let phone = $("#phone").val();
    let check = /^1[3456789]\d{9}$/.test(phone);
    if(phone.length===0){
        $("#phoneCheck").html("")
    }else if(phone.length!==11){
        $("#phoneCheck").html("联系电话为11位数字")
    }else if(!check){
        $("#phoneCheck").html("联系电话校验错误")
    }else{
        $("#phoneCheck").html("")
    }

})

//2019年底起一直留在珠海--->春节前后实际返港时间   
$("#stayFlag").click(function(){
    if($("#stayFlag:checked").val()){
        $("#returnTime").val("").attr("disabled",'disabled');
    }else{
        $("#returnTime").val("").removeAttr("disabled");
    }
   

})


//开始隔离日期->解除隔离日期  
$("#quarantineStartDate").change(function(){
    let startTime = $("#quarantineStartDate").val();
    let times = new Date(startTime).getTime()+14*24*3600*1000
    // let endTime = moment(new Date(times)).format("YYYY-MM-DD")+"T00:00";
    let endTime = moment(new Date(times)).format("YYYY-MM-DD");
    $("#quarantineEndDate").val(endTime);

})

//户籍详细地址
// $("#registerAddress").change(function(){
//     let value = $(this).val();
//     console.log(value)
//     if(value.length>37){
//         $("#content").html("提示：户籍详细地址最多37字")
//         $("#allScreen_2").fadeIn().fadeOut(2000);
//         $(this).val(value.substring(0,37))
//     }
// })

//详细情况
// $("#detailedSituation").change(function(){
//     let value = $(this).val();
//     console.log(value)
//     if(value.length>400){
//         $("#content").html("提示：详细情况最多400字")
//         $("#allScreen_2").fadeIn().fadeOut(2000);
//         $(this).val(value.substring(0,400))
//     }
// })

//座位号
$(document).on('change','.seatNum',function(){
    console.log('删除')
    let seatNum = $(this).val();
    console.log(seatNum)
    let check = /^[A-Za-z0-9]{0,10}$/.test(seatNum);
    if(!check){
        $(this).next().html("座位号最长10个字母+数字")
    }else{
        $(this).next().html("")
    }
})

//其他——>文本框是否禁用
$(document).on('click','.others',function(){
    if(!$(this).is(':checked')){
        console.log("选中")
        $(this).parent().next().val("").attr("disabled","disabled");
    }else{
        $(this).parent().next().val("").removeAttr("disabled");
    }
})



function checkCode(val) {
    let p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
    let code = val.substring(17);
    if(p.test(val)) {
        let sum = 0;
        for(let i=0;i<17;i++) {
            sum += val[i]*factor[i];
        }
        if(parity[sum % 11] == code.toUpperCase()) {
            return true;
        }
    }
    return false;
}

function checkDate(val) {
    let pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
    console.log(pattern.test(val))
    if(pattern.test(val)) {
        let year = val.substring(0, 4);
        let month = val.substring(4, 6);
        let date = val.substring(6, 8);
        let date2 = new Date(year+"-"+month+"-"+date);
        if(date2 && date2.getMonth() == (parseInt(month) - 1)) {
            return true;
        }
    }
    return false;
}

function checkProv(val) {
    let pattern = /^[1-9][0-9]/;
    let provs = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门"};
    if(pattern.test(val)) {
        if(provs[val]) {
            return true;
        }
    }
    return false;
}
console.log(idCardNoUtil)