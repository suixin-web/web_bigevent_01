//入口函数
$(function() {

    // 获取用户信息

})

// 获取用户信息封装函数
// 注意，位置写到入口函数外面，后面代码中要使用这个方法但是要求这个方法是一个全局方法
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: ''
    })
}