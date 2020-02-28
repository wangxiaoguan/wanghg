var descStr = "为您解决使用信科视界产品过程中遇到的问题";
var faqTitle = "使用帮助";
var icHelpUrl = "#http://yq-common-prod.oss-cn-hangzhou.aliyuncs.com/ic_help.png?";

function checkMobileType()
{
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isAndroid){
        return "Android";
    }else if(isiOS){
        return "IOS";
    }else{
        return "PC";
    }
}

function getShareInfo()
{
	var resStr = "";
	if($("#helpContainer").length > 0){
		resStr =  faqTitle + "#" + descStr;
	}else{
		var str = $(".faq-title")[0].innerText;
		resStr =  str + "#" + descStr;
	}
    resStr += icHelpUrl;
	var MobileType = checkMobileType();
    if(MobileType == "Android"){
        window.share.getContent(resStr);
    }else if(MobileType == "IOS"){
        return resStr;
    }
}