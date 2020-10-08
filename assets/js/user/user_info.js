// 入口函数
$(function() {
    // 定义校验规则
    var form = layui.form;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称长度为1~6之间";
            }
        }
    })

    initUserInfo();
    // 初始化用户的基本信息
    var layer = layui.layer;

    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                console.log(res);
            }
        })
    }
})