//封装ajax

/*
    jq：ajax

    $.ajax({ //配置参数
        type : 'get',
        url : xxx,
        data : '',
        async : true,
        success : function(str) {

        }
    });
*/

function ajax2(opt) {
    function extend(obj1, obj2) {
        for (var key in obj2) {
            obj1[key] = obj2[key];
        }
    }

    //默认参数
    var defaults = {
        async: true,
        data: ''
    }

    //后面使用默认参数
    extend(defaults, opt);

    var xhr = new XMLHttpRequest();
    if (defaults.type.toLowerCase() == 'get') {
        //get请求
        if (defaults.data) {
            defaults.url += '?' + defaults.data;
        }
        xhr.open(defaults.type, defaults.url, defaults.async);
        xhr.send(null);
    } else {
        //post请求
        xhr.open(defaults.type, defaults.url, defaults.async);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xhr.send(defaults.data);
    }

    //接收数据返回
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if (defaults.success) { //如果有数据就返回
                    defaults.success(xhr.responseText);
                }
            } else {
                alert('错误http状态码是：' + xhr.status);
            }
        }
    }
}