var express = require('express');
var router = express.Router();
var fs = require('fs');
var globalConfig = require('../config/config');
/* GET users listing. */
router.get('/updataFile', function (req, res, next) {
    console.log(req.url);
    //读取该页面的package.json
    var pageJson = globalConfig.GetLandPath(req.query.channel,req.query.appName,req.query.pageNum,'package.json');
    var pageObj = fs.readFileSync(pageJson, {
        encoding: 'utf8'
    });
    pageObj = JSON.parse(pageObj);
    //拿到模板id和模板版本号
    var page_modle_Id = pageObj.id;
    var page_modle_version = pageObj.version;
    //再那模板id去比对
    var modleJson = './modle_html/template' + page_modle_Id + '/package.json';
    var modleObj = fs.readFileSync(modleJson, {
        encoding: 'utf8'
    });
    modleObj = JSON.parse(modleObj);
    var modle_version = modleObj.version;
    if(page_modle_version == modle_version){
        res.send('yes');
    }else{
        res.send(pageObj)
    }
    // appName: "cs"channelName: "sm"pageNum: "333"
});

module.exports = router;