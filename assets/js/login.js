$(function() {
    // 点击注册，显示注册区域，隐藏登录区域
    $("#link_reg").on('click', function() {
            $(".login-box").hide();
            $(".reg-box").show();

        })
        // 点击登录，显示登录区域，隐藏注册区域
    $("#link_login").on('click', function() {
        $(".login-box").show();
        $(".reg-box").hide();

    })



    var form = layui.form

    var layer = layui.layer

    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码规则
        repwd: function(value) {
            // 选择器必须带空格，选择的是后代中的input，name属性值为password的第一个标签
            var pwd = $('.reg-box [name=password]').val()
                // 比较
            if (pwd !== value) {
                return '两次密码输入不一致';
            }
        }
    });
    // 注册功能
    $("#form_reg").on("submit", function(e) {
            // 阻止表单提交
            e.preventDefault();
            // 发送ajax
            $.ajax({
                method: 'POST',
                url: 'http://ajax.frontend.itheima.net/api/reguser',
                data: {
                    username: $("#form_reg [name=username]").val(),
                    password: $("#form_reg [name=password]").val(),
                },
                success: function(res) {
                    // 返回状态判断
                    if (res.status != 0) {
                        return layer.msg(res.message);
                    }
                    // 提交成功后处理代码
                    layer.msg("注册成功，请登录！");
                    // 手动切换到登录表单
                    $("#link_login").click();
                    // 重置form表单
                    $("#form_reg")[0].reset();
                }
            })
        })
        // 登录功能
        // 提交功能
    $("#form_login").on("submit", function(e) {
        // 阻止表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: 'http://ajax.frontend.itheima.net/api/login',
            data: $(this).serialize(),
            success: function(res) {
                // 返回状态判断
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 提交成功后处理代码
                layer.msg("登陆成功!");
                // 保存token 跳转页面
                localStorage.setItem("token", res.token);
                //    跳转
                location.href = "/index.html"
            }
        })
    })
})