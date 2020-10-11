$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }
    // 初始化富文本编辑器
    initEditor();
    // 1. 初始化图片裁剪器 
    var $image = $('#image')
        // 2. 裁剪选项 
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域 
    $image.cropper(options)
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click()
        })
        // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
            // 获取到文件的列表数组
            var files = e.target.files;
            // 判断用户是否选择了文件
            if (files.length === 0) {
                return layer.msg("请选择要使用的图片")
            }

            // 根据文件，创建对应的 URL 地址    
            var newImgURL = URL.createObjectURL(files[0])
                // 为裁剪区域重新设置图片
            $image
                .cropper('destroy') // 销毁旧的裁剪区域      
                .attr('src', newImgURL) // 重新设置图片路径      
                .cropper(options) // 重新初始化裁剪区域 

        })
        //  设置状态
    var state = "已发布";;
    // $("#btnSave1").on("click", function () { 
    //     state = "已发布";
    // })
    $("#btnSave2").on("click", function() {
            state = "草稿";
        })
        // 添加文章
    $("#form-pub").on("submit", function(e) {
            // 阻止表单默认提交行为
            e.preventDefault();
            // 创建FormData对象，收集数据
            var fd = new FormData(this);
            // 放入状态
            fd.append("state", state);
            // 放入图片
            $image.cropper('getCroppedCanvas', { //创建一个Canvas画布
                    width: 400,
                    height: 280
                })
                // 将Canvas画布上的内容，转化为文件对象
                .toBlob(function(blod) {
                    // 得到文件对象后，进行后续的操作
                    fd.append('cover_img', blod);
                    // ！！！发送！！！ajax，要在toBlod（）函数中
                    console.log(...fd);
                    // fd.forEach(function (value, key) { 
                    //     console.log(key,value);
                    // })
                    publishArticle(fd);
                })
        })
        // 定义一个发布文章的方法

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 跳转页面
                // location.href='/article/art_list.html';
                // 去除bug
                layer.msg("添加成功，页面跳转中。。。")
                setTimeout(function() {
                    window.parent.document.getElementById("art_list").click();
                })
            }
        })
    }




})