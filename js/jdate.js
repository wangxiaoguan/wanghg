/**
 * Jdate 2.0.1
 * Copyright 2017-2019
 * weijhfly https://github.com/weijhfly/jqueryDatePlugin
 * Licensed under MIT
 * Released on: jan 24, 2017
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).Jdate=t()}(this,function(){"use strict";!function(e,t){void 0===t&&(t={});var a=t.insertAt;if(e&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],i=document.createElement("style");i.type="text/css","top"===a&&n.firstChild?n.insertBefore(i,n.firstChild):n.appendChild(i),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(document.createTextNode(e))}}("ul{margin:0;padding:0}li{list-style-type:none}.jdate-container{font-size:20px;color:#333;text-align:center}.jdate-container header{position:relative;line-height:60px;font-size:18px;border-bottom:1px solid #e0e0e0}.jdate-container .jdate-mask{position:fixed;width:100%;height:100%;top:0;left:0;background:#000;opacity:.4;z-index:999}.jdate-container .jdate-panel{position:fixed;bottom:0;left:0;width:100%;height:273px;z-index:1000;background:#fff;-webkit-animation-duration:.3s;animation-duration:.3s;-webkit-animation-delay:0s;animation-delay:0s;-webkit-animation-iteration-count:1;animation-iteration-count:1}.jdate-container .jdate-btn{position:absolute;left:0;top:0;height:100%;padding:0 15px;color:#666;font-size:16px;cursor:pointer;-webkit-tap-highlight-color:transparent}.jdate-container .jdate-confirm{left:auto;right:0;color:#007bff}.jdate-container .jdate-content{position:relative;top:20px}.jdate-container .jdate-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.jdate-container .jdate-wrapper>div{position:relative;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;height:173px;line-height:36px;overflow:hidden;-webkit-flex-basis:-8e;-ms-flex-preferred-size:-8e;flex-basis:-8e;width:1%}.jdate-container .jdate-wrapper ul{position:absolute;left:0;top:0;width:100%;margin-top:68px}.jdate-container .jdate-wrapper li{height:36px}.jdate-container .jdate-dim{position:absolute;left:0;top:0;width:100%;height:68px;background:-o-linear-gradient(bottom,hsla(0,0%,100%,.4),hsla(0,0%,100%,.8));background:-webkit-gradient(linear, left bottom, left top, from(hsla(0, 0%, 100%, 0.4)), to(hsla(0, 0%, 100%, 0.8)));background:-o-linear-gradient(bottom, hsla(0, 0%, 100%, 0.4), hsla(0, 0%, 100%, 0.8));background:linear-gradient(0deg,hsla(0,0%,100%,.4),hsla(0,0%,100%,.8));pointer-events:none;-webkit-transform:translateZ(0);transform:translateZ(0);z-index:10}.jdate-container .mask-top{border-bottom:1px solid #ebebeb}.jdate-container .mask-bottom{top:auto;bottom:1px;border-top:1px solid #ebebeb}.jdate-container .fadeIn{-webkit-animation-name:fadeIn;animation-name:fadeIn}.jdate-container .fadeOut{-webkit-animation-name:fadeOut;animation-name:fadeOut}@-webkit-keyframes fadeIn{0%{bottom:-273px}to{bottom:0}}@keyframes fadeIn{0%{bottom:-273px}to{bottom:0}}@-webkit-keyframes fadeOut{0%{bottom:0}to{bottom:-273px;display:none}}@keyframes fadeOut{0%{bottom:0}to{bottom:-273px;display:none}}@media screen and (max-width:414px){.jdate-container{font-size:18px}}@media screen and (max-width:320px){.jdate-container{font-size:15px}}");var D=void 0!==D?D:"undefined"!=typeof jQuery?jQuery:null,u=36;function e(e){if(D){if(e&&e.el){var t=this,a=t.$(e.el);if(a&&!a.bindJdate&&(a.bindJdate=1,t.extend(e),t.tap(a,function(){t.show()}),e.value)){"input"==a.nodeName.toLowerCase()?a.value=e.value:a.innerText=e.value;var n=e.value.replace(/-/g,"/").replace(/[^\d/:\s]/g,""),i=new Date(n);i&&"Invalid Date"!=i?a.bindDate=i:console.error("Invalid Date锛�"+n)}}}else console.error("jQuery is not defined")}return e.usejQuery=function(e){D=e},e.prototype={constructor:e,baseData:function(){return{domId:{YYYY:"jdate-year",MM:"jdate-month",DD:"jdate-day",hh:"jdate-hour",mm:"jdate-min",ss:"jdate-sec"},opts:{el:"",format:"YYYY-MM-DD",beginYear:2e3,endYear:2100,init:null,moveEnd:null,confirm:null,cancel:null,minStep:1,trigger:"tap",lang:{title:"閫夋嫨鏃ユ湡",cancel:"鍙栨秷",confirm:"纭",year:"骞�",month:"鏈�",day:"鏃�",hour:"鏃�",min:"鍒�",sec:"绉�"}}}},extend:function(e){var t=this.baseData().opts;for(var a in t)if(t[a]&&"[object Object]"==Object.prototype.toString.call(t[a]))for(var n in e[a])t[a][n]=null==e[a][n]?t[a][n]:e[a][n];else t[a]=e[a]||t[a];this.config=t},createUI:function(){for(var e=this,t=e.baseData(),a=e.config,n=t.domId,i=a.format.split(/-|\/|\s|:/g),o=i.length,r="",s=e.$(a.el).bindDate||new Date,d=a.lang,l=0;l<o;l++){var c=i[l];if(r+='<div id="'+n[c]+'"><ul>',"YYYY"==c)for(var p=a.beginYear;p<=a.endYear;p++)r+='<li class="'+(p==s.getFullYear()?"active":"")+'">'+p+d.year+"</li>";else if("MM"==c)for(var f=1;f<=12;f++)r+='<li class="'+(f==s.getMonth()+1?"active":"")+'">'+(f<10?"0"+f:f)+d.month+"</li>";else if("DD"==c)for(var u=e.bissextile(s.getFullYear(),s.getMonth()+1),m=1;m<=u;m++)r+='<li class="'+(m==s.getDate()?"active":"")+'">'+(m<10?"0"+m:m)+d.day+"</li>";else if("hh"==c)for(var h=0;h<=23;h++)r+='<li class="'+(h==s.getHours()?"active":"")+'">'+(h<10?"0"+h:h)+d.hour+"</li>";else if("mm"==c)for(var v=0;v<=59;v+=a.minStep)r+='<li class="'+(v==s.getMinutes()?"active":"")+'">'+(v<10?"0"+v:v)+d.min+"</li>";else if("ss"==c)for(var g=0;g<=59;g++)r+='<li class="'+(g==s.getSeconds()?"active":"")+'">'+(g<10?"0"+g:g)+d.sec+"</li>";r+="</ul></div>"}var b='<div class="jdate-mask"></div>\n            <div class="jdate-panel fadeIn">\n                <header>\n                    <span class="jdate-btn jdate-cancel">'+d.cancel+"</span>\n                    "+d.title+'\n                    <span class="jdate-btn jdate-confirm">'+d.confirm+'</span>\n                </header>\n                <section class="jdate-content">\n                    <div class="jdate-dim mask-top"></div>\n                    <div class="jdate-dim mask-bottom"></div>\n                    <div class="jdate-wrapper">\n                        '+r+"\n                    </div>\n                </section>\n            </div>",x=document.createElement("div");x.className="jdate-container",x.innerHTML=b,document.body.appendChild(x),e.scroll={};for(var j=0;j<o;j++){var y=n[i[j]];e.scroll[i[j]]=y,e.slide(D("#"+y+">ul"))}e.scroll.mm&&1!=a.minStep&&D("#"+e.scroll.mm+" li").eq(Math.round(s.getMinutes()/a.minStep)).addClass("active"),D(".jdate-container ul").each(function(){var e=D(this),t=e.find(".active");if(t.length){var a=-t.position().top;e.animate({top:a},0)}})},eventType:function(){var e="ontouchend"in document;return{isTouch:e,tstart:e?"touchstart":"mousedown",tmove:e?"touchmove":"mousemove",tend:e?"touchend":"mouseup",tcancel:e?"touchcancel":"mouseleave"}},slide:function(e){var c=this,p=c.baseData().domId,f=c.config.lang,a=void 0,n=void 0,i=!1,o=c.eventType();function r(e){var t=e.position().top;e.css("top",Math.round(t/u)*u+"px"),t=Math.round(Math.abs(D(e).position().top));var a=e.children("li").get(t/u);if(D(a).addClass("active").siblings().removeClass("active"),-1!=[p.YYYY,p.MM].indexOf(e.parent().attr("id"))&&c.scroll.DD){var n=D("#"+p.YYYY+" .active").text().replace(/\D/g,""),i=D("#"+p.MM+" .active").text().replace(/\D/g,"");if(!n||!i)return;var o=c.bissextile(n,i);if(o!=D("#"+p.DD+" li").length){var r=D("#"+p.DD+" .active").text().replace(/\D/g,""),s="",d=D("#"+p.DD+" ul");o<r&&(r=o);for(var l=1;l<=o;l++)s+="<li "+(r==l?'class="active"':"")+">"+(l<10?"0"+l:l)+f.day+"</li>";D("#"+p.DD+" ul").html(s),Math.abs(d.position().top)>d.height()-u&&d.css("top","-"+(d.height()-u)+"px")}}c.config.moveEnd&&c.config.moveEnd.call(c)}e.bind(o.tstart,function(e){e.stopPropagation(),e.preventDefault(),e=e.originalEvent,a=e.pageY||e.touches[0].pageY,o.isTouch||(i=!0)}),e.bind(o.tmove,function(e){var t=D(this);if(e.stopPropagation(),e.preventDefault(),e=e.originalEvent,!o.isTouch&&!i)return!1;n=e.pageY||e.touches[0].pageY,t.css("top",t.position().top+(n-a)+"px"),a=n,0<t.position().top&&t.css("top","0"),t.position().top<-(t.height()-u)&&t.css("top","-"+(t.height()-u)+"px")}),e.bind(o.tend,function(e){var t=D(this);e.stopPropagation(),e.preventDefault(),e=e.originalEvent,i=!1,r(t)}),e.bind(o.tcancel,function(e){var t=D(this);e.stopPropagation(),e.preventDefault(),e=e.originalEvent,i=!1,r(t)})},$:function(e,t){return"string"!=typeof e&&e.nodeType?e:t?document.querySelectorAll(e):document.querySelector(e)},tap:function(e,a){if("ontouchstart"in window&&"tap"==this.config.trigger){var n={};e.addEventListener("touchstart",function(e){var t=e.touches[0];n.startX=t.pageX,n.startY=t.pageY,n.sTime=+new Date}),e.addEventListener("touchend",function(e){var t=e.changedTouches[0];n.endX=t.pageX,n.endY=t.pageY,+new Date-n.sTime<300&&Math.abs(n.endX-n.startX)+Math.abs(n.endY-n.startY)<20&&(e.preventDefault(),a.call(this,e)),n={}})}else e.addEventListener("click",function(e){a.call(this,e)})},show:function(){var e=this,t=e.config,a=e.$(t.el);a.bindJdate&&("input"==a.nodeName.toLowerCase()&&a.blur(),e.$(".jdate-container")||t.init&&!1===t.init.call(e)||(e.createUI(),e.event()))},hide:function(e){var t=this.$(".jdate-panel.fadeIn");t&&(t.className="jdate-panel fadeOut",this.destroy(e))},event:function(){var s=this,e=s.$(".jdate-mask"),t=s.$(".jdate-cancel"),a=s.$(".jdate-confirm");s.tap(e,function(){s.hide(1)}),s.tap(t,function(){s.hide(1)}),s.tap(a,function(){var e=s.config,t=s.$(e.el),a=e.format,n=new Date;for(var i in s.scroll){var o=D("#"+s.scroll[i]+" .active").text().replace(/\D/g,"");a=a.replace(i,o),"YYYY"==i?n.setFullYear(o):"MM"==i?n.setMonth(o-1):"DD"==i?n.setDate(o):"hh"==i?n.setHours(o):"mm"==i?n.setMinutes(o):"ss"==i&&n.setSeconds(o)}if(e.confirm){var r=e.confirm.call(s,a);if(!1===r)return!1;r&&(a=r)}"input"==t.nodeName.toLowerCase()?t.value=a:t.innerText=a,s.hide(),t.bindDate=n})},bissextile:function(e,t){var a=void 0;return 1==t||3==t||5==t||7==t||8==t||10==t||12==t?a=31:4==t||6==t||11==t||9==t?a=30:2==t&&(a=e%4!=0||e%100==0&&e%400!=0?28:29),a},destroy:function(e){var t=this,a=t.config;e&&a.cancel&&a.cancel.call(t),setTimeout(function(){var e=t.$(".jdate-container");document.body.removeChild(e)},300)}},e.version="2.0.1",e});