var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var globalConfig = require('../config/config');
var funMethod = require('./method');
/* newPageName 页面渲染 */
router.get('/newPageName', function (req, res, next) {
    res.send('newPageName')
});
/* 新建包名 */
router.get('/ceatePageName', function (req, res, next) {
    let dataObj = req.query;
    // console.log(dataObj);
    //获取渠道及包名
    let channel_val = dataObj.select_text;
    let pageName_val = dataObj.pageName_val;

    let url = globalConfig.landRootPath+'/' + channel_val;
    var pages_arr = fs.readdirSync(url);
    console.log(pages_arr);

    // //判断该渠道下是否存在该包名
    for (var i = 0; i < pages_arr.length; i++) {
        if (pages_arr[i] == pageName_val) {
            return res.send('yes');
        }
    }
    let newUrl = globalConfig.landRootPath +'/'+ channel_val + '/' + pageName_val;
    //在该渠道下创建包名文件夹
    funMethod.mkdirsSync(newUrl);
    res.send('ok');
});

/* 获取渠道 */
router.get('/getChannel', function (req, res, next) {
    let pages_arr = [];
    let urls = globalConfig.landRootPath;
    var arr = fs.readdirSync(urls);
    for(let i = 0; i< arr.length; i++){
        if(arr[i] !='.DS_Store'){
            pages_arr.push(arr[i])
        }
    }
    res.send(pages_arr);

});
module.exports = router;