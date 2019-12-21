var express = require('express');
var router = express.Router();
var fs = require('fs');
var globalConfig = require('../config/config');
var funMethod = require('./method');
/* 拿到模板的缩略图 */
router.get('/newPage', function (req, res, next) {
  res.send('newPage');

});

router.get('/newPageImg', function (req, res, next) {
  var modle_url = './modle_html';
  var modle_arr = fs.readdirSync(modle_url);
  var mouldPicList = [];
  console.log(modle_arr)
  for (var i = 0; i < modle_arr.length; i++) {
    if(modle_arr[i] != '.DS_Store'){
      //读取模板id
      var jsonUrls = './modle_html/' + modle_arr[i] + '/package.json';
      var Obj
      try {
        Obj = fs.readFileSync(jsonUrls); //读取json
      } catch (error) {
        continue
      }
      var jsonObj = JSON.parse(Obj);
      var modleObj = {
        id: jsonObj.id,
        img: 'modle/' + modle_arr[i] + '/remove.jpeg'
      }
      mouldPicList.push(modleObj);
    }

  }
  // console.log(mouldPicList);
  res.send(mouldPicList);
})

module.exports = router;