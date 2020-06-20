
import React,{Component} from "react";
import './home.scss'
export default class Home11 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='home11'> 
<h2>jQuery</h2>
<pre style={{color:'red',fontSize:20,fontWeight:'bold'}}>{`
$("ul li").html("hello world");
$("ul li:eq(2)").html("three");
$("ul li[class=app]").html();
$("ul li").eq(2).html("中华");
$("#first").html("大家好");
$("input").val();
$("input").val("abc");
$("ul li:eq(2)").hide();
$("ul li:eq(2)").show()
$("ul li:eq(2)").css("color","red").css({"fontSize":"12px"})
$("ul li:eq(2)").height(200).width(100);
$("#btn").on("click",function(){
    console.log('hello')
})
`}</pre>
<pre>{`
$("ul").children()
$("li").html("武汉");
$("li").eq(2).siblings()
$("li").eq(2).next()
$("li").eq(2).nextAll()
$("li").eq(2).prev()
$("li").eq(2).prevAll()
$("li").eq(2).nextUntil(".middle")
var li="<li>我是新增的li</li>";
var li=$("<li>我是新增的li</li>");
$("ul").append(li)
li.appendTo($("ul"))
$("ul").prepend(li);
li.prependTo($("ul"))
$("li").after(li)
$("li").before(li)
li.insertBefore($("li"))
li.insertAfter($("li"))
$("ul").wrap("<li>中华</li>")
$("li").remove()
$("li").click(function(){})
$("li").bind("click",function(){})
$(document).on("click","li", function(){})
$(document).delegate("li","click",function(){})
`}</pre>
<pre>{`
$("#red").hide(2000, function () {
    $(this).show(2000)
})

$("#red").slideUp(2000, function () {
    $(this).slideDown(2000)
})

$("#red").slideToggle(2000,"linear")

$("#red").fadeOut(2000, function () {
    $(this).fadeIn(2000)
})

$("#red").fadeToggle(2000)

$("#red").fadeTo(2000,0.2)
`}</pre>
            </div>
    
        )
    }
}


