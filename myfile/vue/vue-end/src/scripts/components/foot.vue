<template>
    <footer>
        <div v-for="(foot,index) in footList " :key="index">
            <router-link :to="{name:foot.name}">
                <i class="iconfont" v-html="foot.icon"></i>
                <span>{{foot.txt}}</span>
            </router-link>
        </div>
    </footer>
</template>

<script>
export default {
    data(){
        return {
            footList:[
                {name:"home",txt:"首页",icon:"&#xe6bb;",path:"/app/home"},
                {name:"find",txt:"发现",icon:"&#xe65c;",path:"/app/find"},
                {name:"mine",txt:"我",icon:"&#xe735;",path:"/app/mine"},
                {name:"exit",txt:"退出",icon:"&#xe603;",path:"/app/exit"},
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
footer{
	position:fixed;
	width:100%;
	height:90px;
	left:0;
	bottom:0;
	background:#fff;
	display:flex;
    z-index:100;
    border-top:1px solid black;
	div{
		flex:1;
		height:90px;
		a{
			display: block;
			width:100%;
			height:100%;
			display:flex;
			flex-direction:column;
			box-sizing:border-box;
			padding:6px 0;
			text-align:center;
			font-family:"微软雅黑";
			color:#999;
			i{
			width:100%;
			height:45px;
			line-height:45px;
			font-size:42px !important;
			}
			span{
				width:100%;
				height:35px;
				line-height:35px;
				font-size:26px;
			}
		}
		.router-link-exact-active{
			color:#0dc441;
		    border-color:#0dc441;
		}

	}
}
</style>
