// var checkall=document.getElementsByClassName("checkall")[0];
// var checklist=document.getElementsByClassName("check");
// var count=0;
// var allcount=checklist.length;


// var result=document.getElementsByClassName("result");
// var jianlist=document.getElementsByClassName("jian");
// var muchlist=document.getElementsByClassName("much");
// var footer=document.getElementsByClassName("footresult")[0];
// var muchs=[];
// var i=document.getElementsByTagName("i")[0];
// i.innerHTML=count;
var jialist=document.getElementsByClassName("jia");
for(var i=0;i<jialist.length;i++){
    var jia=jialist[i];
    jia.onclick=function(){
        var result=this.previousElementSibling;//数量
        var jian=result.previousElementSibling;//减号
         result.innerHTML=result.innerHTML*1+1;//数量叠加
         var  resultall=result.innerHTML
            // alert(result)
            jian.innerHTML="-";//减号出现
        var parent=this.parentNode;//span3节点
        var priceone=parent.previousElementSibling;//span3前一个节点单价
        var price=priceone.innerHTML//得到单价
        // alert(price);
        var alltol=parent.nextElementSibling;//span3后一个节点小计
            alltol.innerHTML=price*1*resultall.toFixed(2);//结果小计

    }
}
var jianlist=document.getElementsByClassName("jian");
for (var i = 0;i<jianlist.length;i++) {
    var jian=jianlist[i];
    jian.onclick=function () {
    var result=jian.nextElementSibling;
    var j=result.innerHTML*1;
    if (i==1) {return false};//数量为1时,函数直接返回
        j--;
    if (j==1) {jian.innerHTML="";}
    
            
    }





}






