/**
 * Created by yaling.he on 2015/11/17.
 */

//渚涘簲鍟嗙鐞嗛〉闈笂鐐瑰嚮鍒犻櫎鎸夐挳寮瑰嚭鍒犻櫎妗�(providerList.html)
$(function () {
    $('.removeProvider').click(function () {
        $('.zhezhao').css('display', 'block');
        $('#removeProv').fadeIn();
    });
});

$(function () {
    $('#no').click(function () {
        $('.zhezhao').css('display', 'none');
        $('#removeProv').fadeOut();
    });
});


//璁㈠崟绠＄悊椤甸潰涓婄偣鍑诲垹闄ゆ寜閽脊鍑哄垹闄ゆ(billList.html)
$(function () {
    $('.removeBill').click(function () {
        $('.zhezhao').css('display', 'block');
        $('#removeBi').fadeIn();
    });
});

$(function () {
    $('#no').click(function () {
        $('.zhezhao').css('display', 'none');
        $('#removeBi').fadeOut();
    });
});

//鐢ㄦ埛绠＄悊椤甸潰涓婄偣鍑诲垹闄ゆ寜閽脊鍑哄垹闄ゆ(userList.html)
$(function () {
    $('.removeUser').click(function () {
        $('.zhezhao').css('display', 'block');
        $('#removeUse').fadeIn();
    });
});

$(function () {
    $('#no').click(function () {
        $('.zhezhao').css('display', 'none');
        $('#removeUse').fadeOut();
    });
});