var express = require('express');
var router = express.Router();
var fs = require('fs');
var globalConfig = require('../config/config');
/* GET home page. */
router.post('/delFile', function (req, res, next) {
    var del_ = req.body;
    let del_channel = del_.channel;
    let del_appName = del_.appName;
    let del_pageNum = del_.pageNum;
    // var url1 = './' + globalConfig.landRootPath +del_channel+ '/'+del_appName +'/'+del_pageNum;
    var url1 = globalConfig.GetLandPath(del_channel, del_appName,del_pageNum)
    function deleteFolder(path) {
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolder(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }

    deleteFolder(url1);
    res.send('ok');


});
module.exports = router;