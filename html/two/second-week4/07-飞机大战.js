function bullet() {
    var valuex=parseInt(slider.style.left)+15+"px";
    var valuey=parseInt(slider.style.top);
    var bulletimg=document.createElement("img");
    bulletimg.className="bullet";
    bulletimg.src="images/zd.png";
    box.appendChild(bulletimg);
    var speed1=100;
    var timer1=null;
    bulletimg.style.display="block";
    bulletimg.style.top=valuey+"px";
    timer1=setInterval(function () {
        bulletimg.style.top=bulletimg.offsetTop-speed1+"px";
        bulletimg.style.left=valuex;
        if (bulletimg.offsetTop<=-15){
            clearInterval(timer1);
            bulletimg.parentNode.removeChild(bulletimg);
        }
    },20)
}

function enemy() {
    i++;
    if(i%10==0){
        var enemyleft=Math.round(Math.random()*365)+"px";
        var enemyimg=document.createElement("img");
        enemyimg.className="enemy";
        enemyimg.src="images/dj.png";
        box.appendChild(enemyimg);
        var speed2=15;
        var timer2=null;
        timer2=setInterval(function () {
            enemyimg.style.top=enemyimg.offsetTop+speed2+"px";
            enemyimg.style.left=enemyleft;
            if (enemyimg.offsetTop>=500){
                clearInterval(timer2);
                enemyimg.parentNode.removeChild(enemyimg);
            }
        },50)
    }

}
function collision() {
    i++;
    var valuex=parseInt(slider.style.left)+15+"px";//飞机的X坐标
    var valuey=parseInt(slider.style.top);//飞机的Y坐标
    var bulletimg=document.createElement("img");
    if (i%10==0) {
        var enemyimg = document.createElement("img");
        var enemyleft = Math.round(Math.random() * 365) + "px";//敌机的X坐标
        enemyimg.className = "enemy";
        enemyimg.src = "images/dj.png";
    }
    bulletimg.className="bullet";
    bulletimg.src="images/zd.png";

    box.appendChild(bulletimg);
    box.appendChild(enemyimg);
    var speed1=25;
    var timer=null;
    var speed2=25;
    bulletimg.style.display="block";
    bulletimg.style.top=valuey+"px";
    timer=setInterval(function () {
        bulletimg.style.top = bulletimg.offsetTop - speed1 + "px";
        bulletimg.style.left = valuex;
        enemyimg.style.top = enemyimg.offsetTop + speed2 + "px";
        enemyimg.style.left = enemyleft;


    },50);
    if (bulletimg.offsetLeft <= enemyimg.offsetLeft && enemyimg.offsetLeft <= bulletimg.offsetLeft + bulletimg.offsetWidth) {
        if (enemyimg.offsetTop - bulletimg.offsetTop <= bulletimg.offsetHeight) {
            clearInterval(timer);
            bulletimg.style.display = "none";
            enemyimg.style.display = "none";
            enemyimg.parentNode.removeChild(enemyimg);
            bulletimg.parentNode.removeChild(bulletimg);
        }
    } else {
        if (bulletimg.offsetTop <= -15) {
            clearInterval(timer);
            enemyimg.parentNode.removeChild(enemyimg);
            bulletimg.parentNode.removeChild(bulletimg);
        }
    }
}



