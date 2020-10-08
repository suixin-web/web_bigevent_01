var baseURL = "http://ajax.frontend.itheima.net"
    // 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
    // 会先调用 ajaxPrefilter 这个函数
    // 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    // options.url = 'http://ajax.frontend.itheima.net' + options.url
    // 拼接对应环境的服务器地址
    options.url = baseURL + options.url;
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }
    // 全局统一挂载complete回调函数
    // 无论成功失败，都是触发complete方法
    options.complete = function(res) {
        // console.log(res.responseJSON);
        var obj = res.responseJSON;
        // 判断 如果是身份认证失败，跳转回登录页面
        if (res.status == 1 && res.message == "身份认证失败！") {
            // 清空本地token
            localStorage.removeItem("tokne");
            // 页面转跳
            location.href = '/login.html';
        }
    }
});