var checkall=document.getElementsByClassName("checkall")[0];
var checklist=document.getElementsByClassName("check");
var count=0;
var allcount=checklist.length;

var jialist=document.getElementsByClassName("jia");
var resultlist=document.getElementsByClassName("result");
var jianlist=document.getElementsByClassName("jian");
var muchlist=document.getElementsByClassName("much");
var footer=document.getElementsByClassName("footresult")[0];
var muchs=[];
var i=document.getElementsByTagName("i")[0];
i.innerHTML=count;

checkall.onclick=function () {
    var status=checkall.checked;
    for (var i=0;i<checklist.length;i++) {
        check = checklist[i];
        check.checked = status;
    }
    if (status){
        count=allcount;
    } else {
        count=0;
    }
};

for (var i=0;i<checklist.length;i++ ) {
    var check = checklist[i];
    check.onclick = function () {
        if (this.checked) {
            count++;
        } else {
            count--;
        }
        if (count ==allcount) {
            checkall.checked = true;
        } else {
            checkall.checked = false;
        }
    }
}

for (i=0;i<muchlist.length;i++){
    muchs[muchs.length]=muchlist[i].innerHTML;
}
var one=function (i) {
    var count=1;
    jialist[i].onclick = function () {
        jianlist[i].innerHTML="-";
        count++;
        muchlist[i].innerHTML=count*muchs[i];
        resultlist[i].innerHTML=count;
        jianlist[i].onclick=function () {
                count--;
            if (count<1) {
                resultlist[i].innerHTML=1;
                jianlist[i].innerHTML="";
                muchlist[i].innerHTML=muchs[i];
            }else{
            resultlist[i].innerHTML=count;
            muchlist[i].innerHTML=count*muchs[i];}
        };
    }
};one(0);one(1);one(2);one(3);

var sum=function () {
    var much=0;
    for (j = 0; j < muchlist.length; j++) {
        much+=parseInt(muchlist[j].innerHTML)
    }
    footer.innerHTML=much;
};

var sumcheck=function(){
    var much=0;
    for (var i=0;i<checklist.length;i++ ) {
    var check = checklist[i];
    check.onclick = function () {
        if (this.checked) {

            much+=this.value*count;
        }else {              
            much-=this.value*count;}
         footer.innerHTML=much;
    }
  }
};
sumcheck();
//单个删除
var deletelist=document.getElementsByClassName("delete");
// delete
for (i=0;i<deletelist.length;i++){
    var isdelete=deletelist[i];
    isdelete.onclick=function () {
        var parent=this.parentNode;
        parent.parentNode.removeChild(parent);
    }
}
//全部删除
var alldelete=document.getElementById("alldelete");
var middlelist=document.getElementsByClassName("middle");
var middle=[];
for (i=0;i<middlelist.length;i++) {
    middle[middle.length]=middlelist[i];
}
alldelete.onclick=function () {
    for (i=0;i<middle.length;i++) {
        var middle1=middle[i];
        var parent = (this.parentNode);
        parent.parentNode.removeChild(middle1);
    }
};


