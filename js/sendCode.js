var axios=require("axios");
var md5=require("md5");
router.get("/code", (req, res) => {
    var phone = req.query.phone;
    var time=30;
    var code = Math.round(Math.random() * 8999) + 1000;
    var str ="【宏观科技】您的验证码为{"+code+"}，请于{"+time+"}分钟内正确输入，如非本人操作，请忽略此短信。"
    axios.post("https://api.miaodiyun.com/20150822/industrySMS/sendSMS", {
    }, {
            params: {
                'accountSid': 'ecc49395b9594ce7a5cf57eee88b89fa',//秒滴ACCOUNT SID
                'smsContent': str,//短信模版+验证码
                'to': phone,//手机号
                'timestamp': '20180803074806',//时间戳
                'sig': md5('ecc49395b9594ce7a5cf57eee88b89faefd6db96f35047d2bf893c9c28ac8c2520180803074806'),//用md5加密的  ACCOUNT SID+AUTH TOKEN+时间戳 要导入md5-node
                'respDataType': 'JSON'
            }
        }).then((result) => {
            if (result.data.respCode == "00000") {
                res.json({
                    code,
                    respCode: '操作成功'
                })
            } else {
                res.json({
                    code: "请求失败",
                    respCode: '操作成功'
                })
            }
        })
})