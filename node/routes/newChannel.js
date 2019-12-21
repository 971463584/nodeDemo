var express = require('express');
var router = express.Router();
var fs = require('fs');
var globalConfig = require('../config/config');
var funMethod = require('./method');


/* newChannel 页面渲染 */
router.get('/newChannel', function (req, res, next) {
    res.send('newChannel');
});
/* newChannel 新建 */
router.get('/newChannelName', function (req, res, next) {
    let dataObj = req.query;
    let channel_val = dataObj.channel_val;
    console.log(channel_val);
    let url = globalConfig.landRootPath;
    funMethod.mkdirsSync(url);
    var pages_arr = fs.readdirSync(url);
    console.log(pages_arr);

    //判断渠道文件夹是否存在
    for (var i = 0; i < pages_arr.length; i++) {
        if (channel_val == pages_arr[i]) {
            return res.send('yes');
        }
    }

    let newUrl = url + '/' + channel_val;
    //创建渠道文件夹
    // fs.mkdirSync(newUrl);
    funMethod.mkdirsSync(newUrl)
    res.send('ok');

});
/* 获取该渠道的全部包名*/
router.get('/selectObj', function (req, res, next) {
    let obj = req.query;
    console.log(obj);
    let urls = obj.select_text;
    //获取渠道
    let channel_url = globalConfig.landRootPath +'/'+urls;
    let channel_arr = fs.readdirSync(channel_url);
    res.send(channel_arr);
});
module.exports = router;