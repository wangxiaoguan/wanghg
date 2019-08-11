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
				{name:"home",txt:"首页",icon:"&#xe71b;",path:"/app/home"},
                {name:"goods",txt:"商品",icon:"&#xe601;",path:"/app/goods"},
                {name:"culture",txt:"茶道",icon:"&#xe613;",path:"/app/culture"},
                {name:"mine",txt:"我的",icon:"&#xe657;",path:"/app/exit"},
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
footer{
	position:fixed;
	width:100%;
	height:95px;
	left:0;
	bottom:0;
	background:#fff;
	display:flex;
    z-index:100;
    border-top:1px solid black;
	div{
		flex:1;
		height:95px;
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
			color:rgb(0, 0, 0);
			
			i{
			width:100%;
			height:65px;
			line-height:65px;
			font-size:58px !important;

			
			}
			span{
				width:100%;
				height:25px;
				line-height:25px;
				font-size:20px;
			}
		}
		.router-link-exact-active{
			color:#7d0aff ! important;
		    border-color:#0dc441;
		}

	}
}
</style>
