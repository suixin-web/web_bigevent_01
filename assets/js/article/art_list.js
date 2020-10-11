$(function() {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器 
    template.defaults.imports.dataFormat = function(date) { 
            const dt = new Date(date) 
            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())
            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        // 定义补零的函数 
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据  
        pagesize: 2, // 每页显示几条数据，默认每页显示2条  
        cate_id: '', // 文章分类的 Id  
        state: '' // 文章的发布状态 
    };
    // 初始化文章列表
    initTable();
    initCate();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template("tpl-table", res)    
                $('tbody').html(htmlStr)
                    // 渲染分页区域
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法 
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项     
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr)
                    // 通过 layui 重新渲染表单区域的UI结构      
                form.render()
            }
        })
    }
    // 筛选功能
    $("#form-search").on("submit", function(e) {
            e.preventDefault();
            // 获取表单中选中项的值
            var state = $("[name=state]").val();
            var cate_id = $("[name=cate_id]").val();
            // 为查询参数对象q中对应的属性赋值
            q.state = state;
            q.cate_id = cate_id;
            // 根据最新的筛选条件，重新渲染表格的数据
            initTable();
        })
        // 定义渲染分页的方法

    function renderPage(total) {
        console.log(total);
        // 调用laypage.render（）方式来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            // prev: "<",
            // next: ">"
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //每页显示多少数据的选择器
            // 触发jump;分页初始化的时候，页码改变的时候
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            // 3.每页展示条数发生改变也会触发jump回调 
            jump: function(obj, first) {
                // obj：所有参数所在的对象，first：是否是第一次初始化分页列表
                // 改变当前页
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 判断，不是第一次初始化分页，才能重新调用初始化文件列表
                if (!first) {
                    // 初始化文章列表
                    initTable();
                }
            }
        });
    }
    initTable();
    // 删除
    $("tbody").on('click', '.btn-delete', function() {
        // 先获取Id，进入到函数中this的代指就变了
        var Id = $(this).attr("data-id");
        // 显示对话框
         
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }     
                    layer.msg('删除文章成功！')
                        // 页面总删除按钮个数等于1，页码大于1：
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--;
                    // if ($("tbody tr").length == 1 && q.pagenum > 1) q.pagenum--;
                    // 因为我们更新成功了，所以需要重新渲染页面中的数据
                    initTable();
                }
            })
            layer.close(index)
        })
    })

})