$(function() {
    //  初始化文章分类列表
    initArtCateList();
    var layer = layui.layer;
    var form = layui.form;

    // 封装初始化文章分类列表
    function initArtCateList() {
        $.ajax({
            // method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取文章分类失败！")
                }

                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
            }
        })
    };
    //  显示添加文章分类列表
    $("#btnAdd").on("click", function() {
            // 利用框架代码，显示提交添加文章类别区域
            indexAdd = layer.open({
                type: 1,
                title: '添加文章分类',
                area: ['500px', '250px'],
                content: $("#dialog-add").html()
            })
        })
        // 通过代理的形式，为form-add 表单绑定 submit事件
    $('body').on("submit", '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 因为我们添加成功了，所以要重新渲染页面中的数据

                layer.msg("恭喜，文章类别添加成功！");
                initArtCateList();
                layer.close(indexAdd);
            }
        })
    })


    //  修改 展示表单
    var indexEdit = null;
    $("tbody").on("click", ".btn-edit", function() {
            // 利用框架代码 显示提示添加文章类别区域
            indexEdit = layer.open({
                    type: 1,
                    title: '修改文章分类',
                    area: ['500px', '250px'],
                    content: $("#dialog-edit").html()
                })
                // 获取id
            var id = $(this).attr('data-id')

            $.ajax({
                // method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    layui.form.val("form-edit", res.data);
                }
            })
        })
        // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $("body").on("submit", "#form-edit", function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 因为我们更新成功了，所以要重新渲染页面中的数据
                initArtCateList();
                layer.msg("文章类别更新成功！");
                layer.close(indexEdit);
            }
        })
    })


    // 通过代理的形式，为删除按钮绑定点击事件
    $("tbody").on("click", ".btn-delete", function() {
        // 先获取Id，进入到函数中this代指就改变了
        var id = $(this).attr("data-id");
        // 显示对话框
        layer.confirm('是否确认删除？', { icon: 3, title: '提示' }, function(index) {
            // do something    
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 因为我们更新成功了，所以要重新渲染页面中的数据

                    layer.msg("删除成功！");
                    layer.close(index);
                    initArtCateList();
                }
            })
        })
    })
})