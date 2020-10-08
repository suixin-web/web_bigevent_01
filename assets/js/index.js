//入口函数
$(function() {

    // 获取用户信息
    getUserInfo();
    // 退出登录功能
    $("#btnLogout").on("click", function() {
        // 退出
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function(index) {
            // 1 清空本地token
            localStorage.removeItem("token");
            // 2 页面跳转
            location.href = "/login.html";
            // 关闭询问框
            layer.close(index);
        });
    })
});

// 获取用户信息封装函数
// 注意，位置写到入口函数外面，后面代码中要使用这个方法但是要求这个方法是一个全局方法
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        success: function(res) {
            // console.log(res);
            // 判断状态码
            if (res.status !== 0) {
                return layui.layer.msg(res.message);

            }
            // 请求成功，渲染用户头像信息
            renderAvatar(res.data)
        },
        // 无论成功失败，都是触发complete方法
        //    complete: function(res) {
        //        console.log(res);
        //        // 判断 如果是身份认证失败，跳转回登录页面
        //        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //            // 删除本地token
        //            localStorage.removeItem("tokne");
        //            // 页面转跳
        //            location.href = '/login.html';
        //        }
        //    }
    })
}






// 封装用户头像渲染函数
function renderAvatar(user) {
    // 用户名（昵称优先，没有就用username）
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp" + name);
    // 用户头像
    if (user.user_pic !== null) {
        // 有头像
        $(".layui-nav-img").show().attr("src", user.user_pic);
        $(".user-avatar").hide();
    } else {
        // 没有头像
        $(".layui-nav-img").hide();
        var text = name[0].toUpperCase();
        $(".user-avatar").show().html(text);
    }
}