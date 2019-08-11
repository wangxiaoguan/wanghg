
import React,{Component} from "react";
import './array.scss'
export default class Array9 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='array9'>
<pre>{`

    var reg=new RegExp("hello","ig");
    var reg=/hello/ig;

    var str="Hello hello world!";
    reg.test(str);
    str.match(reg);                 //['Hello','hello']返回匹配的数据(数组形式)
    str.replace(reg,"you");         //返回匹配数据(字符串形式) you world!
    str.search(reg);                //返回匹配数据的下标位置(数组形式) 0
    str.split(reg);                 //返回拆分数据(数组形式)

    var reg=/[^hello]/ig;
    var reg=/(hellp|world)/ig;
    var reg=/[^hello]/g;
    var reg=/[hello]/g;
    str.match(reg));
    reg.test(str));
 
    /\d/==/[0-9]/;
    /\D/==/[^0-9]/;
    /\w/==/[0-9a-zA-Z_]/;
    /\w/==/[^0-9a-zA-Z_]/;
    var reg=/\d/g;
    var reg=/\D/g;匹配的结果为空时返回null
    var reg=/\w/g;
    var reg=/\W/g;
    var reg=/2+/g;
    var reg=/0*1+/g;
    num.match(reg))

    去除所有空格
    str.replace(/\s+/g, "")

    匹配邮政编码
    var num=/^[1-9]\d{5}$/

    匹配压缩包
    var reg=/^\w+.(zip|jar|rar|iso)$/
    
    匹配手机号
    var reg=/^1(3|5|6|7|8)\d{9}$/
    
    var str="hello world";
    var reg = new RegExp('hello', 'ig');//（默认区分大小写）
    var reg=/hello/ig;
    var reg = new RegExp("[0-9]");
    var reg=/0-9/g;
    reg.test(str));//true;
    //test()测试某个字符串是否符合正则表达式所规定的规则,test()函数是RegExp的函数。
    
    
    var str = "今天6月1号 hello world ";
    str.search(reg);// 查找到返回下标位置，否则返回-1
    str.replace(reg,"2");//返回字符串
    str.match(reg);//返回2
    str.match(reg).length;//返回1
    
    var reg=/[a-z]/;
    var reg=/[^a-z]/;
    var reg=/(a|b|c|d)/;
    ^ //匹配一行的开头
    $ //匹配一行的结尾
    * //匹配前面元字符0次或多次
    + //匹配前面元字符1次或多次
    {n,m}   匹配n-m次
    \d      匹配一个数字字符，/\d/ == /[0-9]/
    \D      匹配一个非数字字符，/\D/ == /[^0-9]/

    var d = /\d/                    //  /[0-9]/
    var D = /\D/                    //  /[^0-9]/
    console.log(d.test(1))          //true
    console.log(D.test(1))          //false
    console.log(D.test(NaN))        //ture

    var w=/\w/                      //  /[0-9a-zA-Z_]/
    var W = /\W/                    //  /[^0-9a-zA-Z_]/
    var str='a'
    console.log(w.test('a'))
    console.log(W.test('a'))
    console.log(str.match(w))
    console.log(str.match(W))       // 匹配不成功返回null
`}</pre>
            </div>
        )
    }
}


