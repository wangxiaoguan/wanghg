
import React,{Component} from "react";
import './array.scss'
export default class Array8 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='array8'>
<pre>{`
    数组的声明有两种 
    关键字	    new Array()   
    特殊符号    []
    var arr = new Array (4);                    //一个参数为数字表示长度
    var arr = new Array (1, 2, 3, 4);
    var arr = [1, 2, 3, 4, 5];

    var arr=[1,2,3,4,5,6,7,8,9];                //数组开头添加元素
    arr.unshift(6);
    console.log(arr);//[6,1,2,3,4,5,6,7,8,9]

    var arr=[1,2,3,4,5,6,7,8,9];                //数组结尾添加元素
    arr.push(6);
    console.log(arr);//[1,2,3,4,5,6,7,8,9,6]

    var arr=[1,2,3,4,5,6,7,8,9];                //删除数组开头元素
    arr.shift();
    console.log(arr);//[2,3,4,5,6,7,8,9]

    var arr=[1,2,3,4,5,6,7,8,9];                //删除数组结尾元素
    arr.pop();
    console.log(arr);//[1,2,3,4,5,6,7,8]

    var arr=[1,2,3,4,5,6,7,8,9];
    arr.splice(index,1)                         删除下标为index的样式
    arr.splice(2,1);                            //删除下标1起的1个元素
    console.log(arr);                           //[1,2,4,5,6,7,8,9]

    var arr=[1,2,3,4,5,6,7,8,9];
    arr.splice(1,1,"a");                        //修改下标1元素
    console.log(arr);                           //[1,a,3,4,5,6,7,8,9]

    var arr=[1,2,3,4,5,6,7,8,9];        
    arr.splice(1,0,"a");                        //在下标1之前添加元素
    console.log(arr);                           //[1,a,2,3,4,5,6,7,8,9]

    var arr = ['2016'];
    arr.indexOf(2016);                          //-1
    arr.indexOf("2016");                        //1
    数组Array不会做隐式类型转换

    var str = '2019';
    console.log(str.split(','))                 //['2019']

    var arr = ['2019'];
    console.log(arr.join(','))                  //2019

    Array.from('foo')                           //["f", "o", "o"]
    Array.from(123456)                          //[]
    Array(7).length                             //7

    数组有真数组和伪数组
    list  instanceof Array  	                //true或false
    Array.isArray(list)		                    //true或false
    arr.includes(e))                            //判断数组是否存在某元素

    //数组拼接
    var arr1 = ["a", "b", "c"];
    var arr2 = ["e", "f", "g"];
    var arr3 = ["h", "i", "j"];
    var arr4 =arr1.concat(arr2,arr3);           不会改变原来的数组,返回新数组。
    console.log(arr4);//["a", "b", "c", "e", "f", "g", "h", "i", "j"]

    //合并数组
    var arr1 = [1,2];
    var arr2 = [3];
    var arr3 = [4,5];
    console.log([...arr1,...arr2,...arr3]);     //[1,2,3,4,5]

    //与解构赋值结合
    const [first, ...rest] = [1, 2, 3, 4, 5];
    console.log(first)                          // 1
    console.log(rest)                           // [2, 3, 4, 5]
    const [first, ...rest] = [];
    console.log(first)                          // undefined
    console.log(rest)                           // []

    //扩展运算符还可以将字符串转为真正的数组
    console.log([...'hello'])                   //["h", "e", "l", "l", "o"]

    //Array.of方法用于将一组值，转换为数组
    Array.of(3, 11, 8)          // [3,11,8]
    Array.of(3)                 // [3]
    Array.of(3).length          // 1
    Array.of()                  // []
    Array.of(undefined)         // [undefined]

    Array()                     // []
    Array(3)                    // [, , ,]
    Array(3, 11, 8)             // [3, 11, 8]

    
    数组实例的find方法，用于找出第一个符合条件的数组成员。
    var num = [1, 4, -5, 10].find((n) => n < 0)
    console.log(num)            //-5

    //对数组进行反转
    var arr = [1, 2, 3];
    arr.reverse();
    console.log(arr)//[3,2,1]


    arr.join("-") ; 		                    //对数组里面每一个数进行拼接处理
    arr.indexOf(6); 		                    //返回下标位置 不存在就返回-1
    arr.lastIndexOf(0); 	                    //倒着找


    arr.sort((a, b)=>{                          //数组的排序
        return b - a;
    });   	

    arr.filter(item=>{                          //数组的过滤
        return item >= 10
    });		

    arr.every(item=>{                           //判断所有的数是否都满足某个条件
        return item >= 1
    });  	

    arr.some(item=>{                            //判断是否有一个满足条件
        return item > 20
    });  	

    arr.reduce(f(a, b)=>{                       //数组的迭代操作
        return a - b
    }); 	

    arr.map(item=>{                             //循环数组的值
        console.log(item);
    }); 	

    arr.forEach((item,index)=>{                 //对数组进行循环操作
        console.log(index +"—"+ item);
    }) 	
`}</pre>
<h2>截取数组</h2>
<h3>splice会改变原数组，slice不会改变原数组</h3>
<pre>{`
    var arr = [1,2,3,4,5,6,7,8,9]
    console.log(arr.slice(1,6))                 //[2, 3, 4, 5, 6]
    var arr2 = arr.splice(1,6)
    console.log(arr)                            //[1, 8, 9]
    console.log(arr2)                           //[2, 3, 4, 5, 6, 7]

    var arr = [1,2,3,4,5,6,7,8,9]
    console.log(arr.slice(1))                   //[2,3,4,5,6,7,8,9]
    var arr2 = arr.splice(1)
    arr.splice(1)<==>arr.splice(1,arr.length)
    console.log(arr)                            //[1]
    console.log(arr2)                           //[2,3,4,5,6,7,8,9]

    var arr = [1,2,3,4,5,6,7,8,9]
    console.log(arr.slice(-1))                  //[9]
    var arr2 = arr.splice(-1)
    console.log(arr)                            //[1, 2, 3, 4, 5, 6, 7, 8]
    console.log(arr2)                           //[9]

    var arr = [1,2,3,4,5,6,7,8,9]
    console.log(arr.slice(9))                   //[]
    var arr2 = arr.splice(9)
    console.log(arr)                            //[1, 2, 3, 4, 5, 6, 7, 8, 9]
    console.log(arr2)                           //[]
    
`}</pre>
<h2>数组去重</h2>
<pre>{`
基本思路：ES6提供了新的数据结构Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。
Set函数可以接受一个数组（或类似数组的对象）作为参数，用来初始化。
var arr = [1,2,3,4,5,6,3,2,7,9,8]
console.log([...new Set(arr)])                  //[1, 2, 3, 4, 5, 6, 7, 9, 8]

var arr = [1,2,3,4,5,6,3,2,7,9,8]
console.log(Array.from(new Set(arr))            //[1, 2, 3, 4, 5, 6, 7, 9, 8]

var arr = [1,2,3,[4,5],[6,7,[8,9]]];
console.log([].concat(...arr))                  //[1, 2, 3, 4, 5, 6, 7, [8, 9]]

var arr=[
    {name:'wang',age:18},
    {name:'hong',age:20},
    {name:'guan',age:22},
    {name:'wang',age:18},
    {name:'wang',age:18},
    {name:'guan',age:22},
]
var hash = {};
var arr2 = arr.reduce(function(item, next) {
    hash[next.name] ? '' : hash[next.name] = true && item.push(next);
    return item
}, [])
console.log(arr2); //[{name: "wang", age: 18},{name: "hong", age: 20},{name: "guan", age: 22}]

`}</pre>
<h2>多维数组转化为一维数组</h2>
<pre>{`
    var arr = [1,[2,[[3,4],5],6]]
    console.log(arr.join(',').split(','))       //["1", "2", "3", "4", "5", "6"]

    var arr=[1,3,5,[6,[0,[1,5]],9]]
    console.log(arr.toString().split(','))      //["1", "3", "5", "6", "0", "1", "5", "9"]

    concat方法只能把二维数组转为一维数组
    var arr = [[1,2],'3','4',[5,6],[7]];
    console.log([].concat.apply([],arr));       // [1, 2, "3", "4", 5, 6, 7]


    flat()、flatMap()为es6新增加的方法,该方法返回一个新数组，对原数据没有影响。
    flat()默认只会'拉平'一层，如果想要“拉平”多层的嵌套数组，
    可以将flat()方法的参数写成一个整数，表示想要拉平的层数，默认为1。

    var arr = [1, 2, [3, [4, 5]]]
    console.log(arr.flat())                     // [1, 2, 3, [4, 5]]
    

    var arr = [1, 2, [3, [4, 5]]]
    console.log(arr.flat(2))                    // [1, 2, 3, 4, 5]

    如果不管有多少层嵌套，都要转成一维数组，可以用Infinity关键字作为参数。
    var arr = [1,3,5,[6,[0,[1,5]],9]]
    console.log(arr.flat(Infinity))             //[1, 3, 5, 6, 0, 1, 5, 9]
`}</pre>
            </div>
        )
    }
}


