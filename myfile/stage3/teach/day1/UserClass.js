

var {User} = require("./user");

// call / apply 实现继承  改变this 指向  

// call/apply 只能得到父类的 构造器  无法得到父类的prototype 
function UserClass(name,age,word,salary){
    this.salary = salary;
  
    User.apply(this,[name,age,word])
}

// var u2 = new UserClass('小英子',20,"我要减肥","10000000000")

// 得到 prototype 原型对象 
// 1.  直接赋值 
// UserClass.prototype = new User(); 

// 2.  对象赋值 
for(var i in User.prototype){
    UserClass.prototype[i] = User.prototype[i]
}

UserClass.prototype.walk = function(){
    return "I should be more work hard "
}




exports.UserClass = UserClass;