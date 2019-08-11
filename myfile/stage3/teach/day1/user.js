

// 构造函数 
function User(name,age,word){
    this.name = name;
    this.age = age;
    this.word = word;
}

// prototype 原型对象 
User.prototype = {
    msg:"daydayup",
    say:function(){
        return `${this.name} 说----- ${this.word}`
    }
}


console.log(User.age,User.msg);


exports.User = User;

