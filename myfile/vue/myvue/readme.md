

# 移动端 适配    

# px/100 

# 媒体查询  等比缩放 

# 先通过媒体查询 得到设备的宽度  然后 根据 设备的宽度  比  当前设计稿的宽度 就是 比例关系  

# 这个比例关系 也就是  当前设备的rem /  设计稿的 rem

# mobile/Ps  = mRem / 100 

# 375 /  750  =  mRem / 100                    mRem = 50px; 


#  机型    设备宽度   设计稿宽     设计稿rem    设备rem     div实际宽度     css/rem  px  

#  6/6s    375px      750px        100px        50px        200px         2rem    100px



# px   实际尺寸
# rem  页面的根节点的字体大小   HTML  标签
# vw   页面宽度1/100     百分之一    1vw = devicewidth/100
# vh   页面高度的1/100    百分之一   1vh =  deviceheight/100
# em    当前元素的父元素的字体大小  
