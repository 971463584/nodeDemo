var express = require('express');
var fs = require('fs'); //文件模块
var router = express.Router();
var globalConfig = require('../config/config');
router.post('/editFile', function (req, res, next) {
    var obj = req.body;
    //读取json文件
    fs.readFile(globalConfig.GetLandPath(obj.channel,obj.appName,obj.pageNum,"package.json"), 'utf-8', function (err, data) {
        if (err) {
            res.send('文件读取失败');
        } else {
            // console.log(data);
            var dataObj = JSON.parse(data);
            console.log(dataObj);

            //根据模板号传回对应得数据
            if (dataObj.id == '1') {
                res.send(dataObj);
            } else if (dataObj.id == '2') {
                res.send(dataObj);
            } else if (dataObj.id == '3') {
                res.send(dataObj);
            }
        }
    });
});
module.exports = router;