const html = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<style type="text/css">
		fieldset{width:500px;overflow: hidden;}
		legend{padding:0 10px; border: 1px solid black;}
		label{display: inline-block;width:20px;height:20px;border:1px solid black;background:#aaa;font-size:12px;transition:3s;}
		input:checked+label{background:red;border-color:blue;}
		.file{background: red;}
		input:focus{outline: none}
		audio{background:url(../images/logo.jpg);}
	</style>
</head>
<body>
	
	
	
	
	<form>
		<fieldset>
			<legend align="center">登录</legend>

		<input type="text" list="a"><br>
		<datalist id="a">
			<option value="111"> 
			<option value="222"> 
			<option value="333"> 
			<option value="444"> 
			<option value="555"> 
		</datalist><br>

		<input type="number" min="1" max="15" step="15" placeholder><br>

		<input type="range"  autofocus><br>

		<input type="color" autofocus><br>

		<input type="url" require><br>

		<input type="date" require><br>

		<input type="email"  require><br>

		<input type="submit"><br>

		<input type="file"><br>

		<input style="width: 200px" type="image" src="http://wanghg.top/images/img5.jpg"><br>

        <input type="text" placeholder="请输入姓名"><br>
   
        <input type="password" placeholder="请输入密码" ><br>
	
		<input type="radio" name="sex">男<br>
		
        <input type="radio" name="sex">女<br>
    
		<input type="checkbox">水果<br>
		
		<input type="checkbox">蔬菜<br>

        <select>
        	<option>水果</option>
            <option>蔬菜</option>
            <option>海鲜</option>
            <option>肉类</option>
        </select><br>

        <input type="submit" value="注册"><br>
        <input type="button" value="确定"><br>
        <input type="reset" value="重置"><br>
		<textarea cols="20" rows="3"></textarea>
        </fieldset>
	</form>
</body>
</html>
`

export default html