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
        // 用户渲染
    initUserInfo();
    // 初始化用户的基本信息
    var layer = layui.layer;

    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // console.log(res);
                // 成功后进行渲染
                form.val('formUserInfo', res.data);
            }
        })
    }
    // 重置表单数据
    // 为什么不用按钮的默认重置行为
    // 重置是将你所有的input初始化为html中value中的初始值，与js无关
    // 给form表单绑定事件用reset事件，给按钮绑定事件用click
    $('#btnReset').on('click', function(e) {
            // 阻止表单默认重置行为
            e.preventDefault();
            initUserInfo();
        })
        // 监听表单的提交事件
    $('.layui-form').on("submit", function(e) {
        // 阻止表单默认重置行为
        e.preventDefault();
        // 发起ajax数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 成功
                layer.msg("修改用户信息成功！");
                // 调用父页面中的方法，重新渲染用那个花头像和用户的信息
                window.parent.getUserInof();
            }
        })

    })



})