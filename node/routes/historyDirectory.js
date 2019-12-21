const express = require('express');
const router = express.Router();
const fs = require('fs');
var globalConfig = require('../config/config');
var funMethod = require('./method');
/* 拿到落地页的信息 */
router.get('/historyDirectory', function (req, res, next) {
    let pageArr = [];
    var paths = globalConfig.landRootPath + req.query.paths;
    let arr = fs.readdirSync(paths);
    for(let i = 0 ; i<arr.length; i++){
        let urls = paths + '/' + arr[i] + '/package.json';
        // console.log(urls)
        if(fs.existsSync(urls)){
            let urlsObj = fs.readFileSync(urls);
            urlsObj = JSON.parse(urlsObj);
            // console.log(urlsObj)
            let objs = {
                id: urlsObj.id,
                channel: urlsObj.data.channelName,
                appName: urlsObj.data.appName,
                lodiy: arr[i]
            }
            pageArr.push(objs)
        }
    }
    res.send(pageArr);
});


/*判断落地页号是否存在*/
router.get('/isDirectory', function (req, res,next) {
    var obj = req.query;
    let channelName = obj.channelName;
    let pageName = obj.appName;
    let pageNum = obj.pageNum;
    let urls = globalConfig.landRootPath +'/'+ channelName + '/' + pageName + '/' + pageNum;
    if (fs.existsSync(urls)) {
        return res.send('yes');
    } else {
        res.send('no');
    }

});

/*跑所有的package.json将数据刷为最新数据*/
router.post('/copyPage',function (req, res, next) {
    let obj = req.body;
    let newChannel = obj.newChannel;
    let newAppName = obj.newAppName;
    let newPageName = obj.newPageName;
    let oldChannel = obj.oldChannel;
    let oldAppName = obj.oldAppName;
    let oldPageName = obj.oldPageName;
    let oldUrl = globalConfig.GetLandPath(oldChannel, oldAppName, oldPageName,'index.html')
    let oldUrlImg = globalConfig.GetLandPath(oldChannel, oldAppName, oldPageName,'remove.jpeg')
    //创建文件加
    funMethod.mkdirsSync(globalConfig.GetLandPath(newChannel, newAppName, newPageName));
    //复制就文件加的内容
    //index.html
    fs.writeFileSync(globalConfig.GetLandPath(newChannel, newAppName, newPageName,'index.html'), fs.readFileSync(oldUrl));
    //remove图片
    funMethod.copyPicture(oldUrlImg, globalConfig.GetLandPath(newChannel, newAppName, newPageName,'remove.jpeg'))
    //package.json
    let oldUrlJson = globalConfig.landRootPath +'/'+ oldChannel + '/' + oldAppName + '/' + oldPageName;
    let oldObj = fs.readFileSync(oldUrlJson + '/package.json',{encoding: 'utf8'});
    //修改对象
    oldObj = JSON.parse(oldObj);
    oldObj.data.channelName = newChannel;
    oldObj.data.appName = newAppName;
    oldObj.data.pageNum = newPageName;
    fs.writeFileSync(globalConfig.GetLandPath(newChannel, newAppName, newPageName,'package.json'),JSON.stringify(oldObj));
    //imgs
    let oldImg = globalConfig.GetLandPath(oldChannel, oldAppName, oldPageName,'imgs');
    let newImg = globalConfig.GetLandPath(newChannel, newAppName, newPageName,'imgs');
    funMethod.copyDir(oldImg,newImg);
})
module.exports = router;