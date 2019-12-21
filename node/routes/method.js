const fs = require('fs');
var path = require("path"); 
const puppeteer = require('puppeteer');
var globalConfig = require('../config/config');
/*==================================================*/
function PictureFormat(img, landPagepath) {
	if (img.indexOf('.jpg') >= 0) {
		var suffix = '.jpg';
	} else if (img.indexOf('.png') >= 0) {
		var suffix = '.png';
	} else if (img.indexOf('.gif') >= 0) {
		var suffix = '.gif';
	} else if (img.indexOf('.jpeg') >= 0) {
		var suffix = '.jpeg';
	} else {
		var u = {
			"error": 2,
			"message": 'Please upload the correct format'
		};
		res.end(JSON.stringify(u));
		return false;
	}
	var url = landPagepath + "/imgs/" + Date.now() + suffix;

	//给图片修改名称
	fs.renameSync(img, url);
	// var imgurl;
	return {
		"error": 0,
		"url": url
	}
}

async function puppeteerToScreenshot(url, paths) {
	const browser = await puppeteer.launch({
		args: [
			'--disable-setuid-sandbox',
			'--no-sandbox',
			'--disable-dev-shm-usage',
		]
	});
	const page = await browser.newPage();
	await page.goto(url);
	await page.emulate(require('puppeteer/DeviceDescriptors')['iPhone 6']);
	await page.waitFor(500);
	await page.screenshot({
		path: paths,
		type: "jpeg",
		quality: 60,
	});
	await page.close();
	await browser.close();
}

function updatas(up_pageJson) {
	//读取该落地页的json

	let up_pageObj = fs.readFileSync(up_pageJson, {
		encoding: 'utf8'
	});
	up_pageObj = JSON.parse(up_pageObj);
	//读取模板的新page.json
	let new_modleJson = './modle_html/template' + up_pageObj.id + '/package.json'
	let new_modleObj = fs.readFileSync(new_modleJson, {
		encoding: 'utf8'
	});
	new_modleObj = JSON.parse(new_modleObj);
	//将模板保持一致
	up_pageObj.version = new_modleObj.version;
	console.log(up_pageObj);

	//重新写入package.json
	fs.writeFileSync(up_pageJson, JSON.stringify(up_pageObj));
}

function copyPicture(localImg, newImg) {
	fs.readFile(localImg, function (err, originBuffer) { //读取图片位置（路径）
		// console.log(Buffer.isBuffer(originBuffer));
		fs.writeFile(newImg, originBuffer, function (err) { //生成图片2(把buffer写入到图片文件)
			if (err) {
				console.log(err)
			}
		});
	})
}

function getLandPagePath(channelName, appName, pageName) {
	let urls = globalConfig.landRootPath + '/' + channelName + '/' + appName + '/' + pageName;
	return urls;
}

//递归创建目录 同步方法  
function mkdirsSync(dirname) {  
    //console.log(dirname);  
    if (fs.existsSync(dirname)) {  
        return true;  
    } else {  
        if (mkdirsSync(path.dirname(dirname))) {  
            fs.mkdirSync(dirname);  
            return true;  
        }  
    }  
} 


function copyDir(src, dist, callback) {
	fs.access(dist, function(err){
	  if(err){
		// 目录不存在时创建目录
		fs.mkdirSync(dist);
	  }
	  _copy(null, src, dist);
	});
  
	function _copy(err, src, dist) {
	  if(err){
		callback(err);
	  } else {
		fs.readdir(src, function(err, paths) {
		  if(err){
			callback(err)
		  } else {
			paths.forEach(function(path) {
			  var _src = src + '/' +path;
			  var _dist = dist + '/' +path;
			  fs.stat(_src, function(err, stat) {
				if(err){
				  callback(err);
				} else {
				  // 判断是文件还是目录
				  if(stat.isFile()) {
					fs.writeFileSync(_dist, fs.readFileSync(_src));
				  } else if(stat.isDirectory()) {
					// 当是目录是，递归复制
					copyDir(_src, _dist, callback)
				  }
				}
			  })
			})
		  }
		})
	  }
	}
  }

module.exports = {
    PictureFormat,
    puppeteerToScreenshot,
    updatas,
    copyPicture,
    getLandPagePath,
	mkdirsSync,
	copyDir
}