$(function() {
    var form = layui.form;

    form.verify({
        pwd: [/^[\S]{6,12}$/, '请正确输入6~12位密码，不能带有空格'],
        // 新旧密码不能一致
        samePwd: function(value) {
            // var vnew = $("[name=oldPwd]").val();
            // value是新密码，旧密码需要进行获取
            if (value === $("[name=oldPwd]").val()) {
                return "新密码不能与原密码一致！";
            }
        },
        // 两次密码必须相同
        rePwd: function(value) {
            // value是再次输入的新密码，新密码需要再次重新获取
            if (value === $("[name=oldPwd]").val()) {
                return "确认密码输入不一致！";
            }
        },



    });
    $(".layui-form").on("submit", function(e) {
        // 阻止表达默认提交行为
        e.preventDefault();
        $.ajax({
            method: "post",
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg("修改密码成功！");
                // 将jQuery对象转化为原生dom对象，重置表单
                $(".layui-form")[0].reset();
            }

        })

    });





});