class Human {
    constructor(name) {
        this.name = name;
    }
    breathe() {
        console.log(this.name + " is breathing");
    }
} 
// var man = new Human("jarson");
// man.breathe();

class Man extends Human {
    constructor(name, sex) {
        super(name);
        this.sex = sex;
    }
    info(){
        console.log(this.name + ' is ' + this.sex);
    }
}
var manOne = new Man('jarson', 'boy');
manOne.breathe();   
manOne.info(); 