var userinfo ={


    userlogin:function(url,data){
        var p=new Promise(function(resolve,reject){
            $.ajax({
                type:"get",
                url:url,
                data:{username:data.username1,pwd:data.userpwd1},
                dataType:"json",
                fn:function(result){
                    resolve(result);
                }
            })            
        });
        return p;
    },



    userregister:function(url,data){
        var p=new Promise(function(resolve,reject){
            $.ajax({
                type:"get",
                url:url,
                data:{username:data.username,userpwd:data.userpwd},
                dataType:"json",
                fn:function(result){
                    resolve(result);
                   
                }
            })
        });
        return p;
    },





    sendcode:function(url,data){
        var p=new Promise(function(resolve,reject){
            $.ajax({
                type:"get",
                url:url,
                data:{phone:data.phone},
                dataType:"json",
                fn:function(result){
                    resolve(result);
                }
            })
        });
        return p;
    },



    telregister:function(url,data){
        var p=new Promise(function(resolve,reject){
            $.ajax({
                type:"get",
                url:url,
                data:{phone:data.phone,code:data.code,userpwd:data.userpwd},
                dataType:"json",
                fn:function(result){
                    resolve(result);
                   
                }
            })
        });
        return p;
    },




    usercenter:function(url,data){
        var p=new Promise(function(resolve,reject){
            $.ajax({
                type:"get",
                url:url,
                data:{phone:data.phone1,username:data.username1,userage:data.userage1,usersex:data.usersex1},
                dataType:"json",
                fn:function(result){
                    resolve(result);
                }
            })
        });
        return p;
    },


    deleteuser:function(url,data){
        var p=new Promise(function(resolve,reject){
            $.ajax({
                type:"get",
                url:url,
                data:{id:data.id},
                dataType:"json",
                fn:function(result){
                    resolve(result);
                }
            })
        });
        return p;
    },



    userlist:function(url,data){
        var p=new Promise(function(resolve,reject){
            $.ajax({
                type:"get",
                url:url,
                data:{key:data.key,
                    order:data.order,
                    desc:data.desc,
                    pagenum:data.pagenum,
                    datanum:data.datanum},
                dataType:"json",
                fn:function(result){
                    resolve(result);
                }
            })
        });
        return p;
    },



    usersearch:function(url,data){
        var p=new Promise(function(resolve,reject){
            $.ajax({
                type:"get",
                url:url,
                data:{key:data.key},
                dataType:"json",
                fn:function(result){
                    resolve(result);
                }
            })
        });
        return p;
    },


    goodscarupdate:function(url,data){
        var p=new Promise(function(resolve,reject){
            $.ajax({
                type:"get",
                url:url,
                data:{id:data.id,num:data.num},
                dataType:"json",
                fn:function(result){
                    resolve(result);
                }
            })
        });
        return p;
    },

    goodscardelete:function(url,data){
        var p=new Promise(function(resolve,reject){
            $.ajax({
                type:"get",
                url:url,
                data:{id:data.id},
                dataType:"json",
                fn:function(result){
                    resolve(result);
                }
            })
        });
        return p;
    },
   

    goodscarsearch:function(url,data){
        var p=new Promise(function(resolve,reject){
            $.ajax({
                type:"get",
                url:url,
                data:{userid:data.userid,order:data.order,desc:data.desc,pagenum:data.pagenum,datanum:data.datanum},
                dataType:"json",
                fn:function(result){
                    resolve(result);
                }
            })
        });
        return p;
    },



    goodscarcount:function(url,data){
        var p=new Promise(function(resolve,reject){
            $.ajax({
                type:"get",
                url:url,
                data:{userid:data.userid},
                dataType:"json",
                fn:function(result){
                    resolve(result);
                }
            })
        });
        return p;
    },


}



















