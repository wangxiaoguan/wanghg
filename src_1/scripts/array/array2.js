
import React,{Component} from "react";
import './array.scss'
export default class Array5 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='array5'>
<pre style={{padding:0,margin:0,fontSize:20}}>{`
    数据类型的转换  String  Number  Boolean
    -  *  /  %
    +=  -+  *= /=  %=
    num++  ++num    num--   --num
    ==   ===   !=  !==  >=  <=
    var i=3;
    var num=++i+(i++)+i+(++i);//4+4+5+6
    var num=++i+i+(++i)+i++;//4+4+5+5

    parseInt()从左往右转换，遇到非数字时结束，向下取整
    parseFloat()从左往右转换，遇到非数字时结束，并保留小数点

    Number类型特殊值:NaN  Infinity(正无穷大)

    1/Infinity;                         //0
    var num =12345678;
    console.log(num.length);            //undefined
    number类型length长度属性
    number类型没有indexOf()方法
    var num1=070;八进制                 //56
    var num2=0x70;十六进制              //112

    数学计算：
    四舍五入:Math.round(12.3)  12
            Math.round(12.5)  13
    向上取整:Math.ceil(12.1) 13
    向下取整:floor.floor(12.9) 12
    绝对值：Math.abs(-3)  3
    X的Y次方：Math.pow(2,3)  8
    π值：Math.PI=3.141592654
    随机取数0-1之间的数；Math.random()
    负数五舍六入：-4.5=-4、-4.6=-5

    四舍五入运算
    var a = 10.7456
    console.log(~~a) //=>10

    var b=11.8765
    console.log(b>>0)//=>11

    var f=12.8765
    console.log(f<<0)//=>12

    var c=13.8765
    console.log(c|0)//=>13

    var d=14.5543
    console.log(d+.5|0)//=>15

    var f=14.0543
    console.log(d+.5|0)//=>15

    parseInt(num).toString(2);          //10进制转2进制
    parseInt(num).toString(8);          //10进制转8进制
    parseInt(num).toString(16);         //10进制转16进制
    parseInt(num,2).toString(8);        //2进制转8进制
    parseInt(num,2);                    //2进制转10进制
    parseInt(num,2).toString(16);       //2进制转16进制
    parseInt(num,8).toString(2);        //8进制转2进制
    parseInt(num,8);                    //8进制转10进制
    parseInt(num,8).toString(16);       //8进制转16进制
    parseInt(num,16).toString(2);       //16进制转2进制
    parseInt(num,16).toString(8);       //16进制转8进制
    parseInt(num,16);                   //16进制转10进制

    parseInt(null)                      //NaN
    parseInt(undefined)                 //NaN
    Number(null)                        //0
    Number(undefined)                   //NaN
    Number('abc');                      //NaN
    1-undefined                         //NaN
    1>NaN                               //false

    js转换成bool值的六个false
    !0 = true,              !undefined = true
    !'' = true,             !NaN  = true
    ! null = true ,         !false  = true

    3&&2   //2
    0&&1   //0
    3&&0   //0
    3||2   //3
    0||2   //2
    3||0   //3

    NaN == NaN                          //false
    NaN == undefined                    //false
    NaN == false                        //false
    NaN == null                         //false
    undefined == null                   //true
    null == null                        //true
    undefined == undefined              //true

    Math.max(...[14, 3, 77]);           //77
    Math.max(14, 3, 77);                //77

    Number.MAX_VALUE          // 1.7976931348623157e+308
    Number.MIN_VALUE          // 5e-324
    Number.MAX_SAFE_INTEGER   // 9007199254740991
    Number.MIN_SAFE_INTEGER   // -9007199254740991
`}</pre>
            </div>
        )
    }
}


