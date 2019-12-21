const express = require('express');
const router = express.Router();
const fs = require('fs');
const multiparty = require('multiparty');
var globalConfig = require('../config/config');
var funMethod = require('./method');
/*========================================*/

/*模板一*/
router.post('/modles', function (req, res) {
	//判断请求地址是否来自更新
	if (req.headers.referer.includes('historyPage')) {
		// 拿到模板号
		var pageName = req.body.pageNum;
		var appName = req.body.appName;
		var channel = req.body.channel;
		funMethod.updatas(globalConfig.GetLandPath(channel, appName, pageName, "package.json"));
		//读取该落地页的json
		let up_pageObj = fs.readFileSync(globalConfig.GetLandPath(channel, appName, pageName, "package.json"), {
			encoding: 'utf8'
		});
		up_pageObj = JSON.parse(up_pageObj);
		//循环生成配置
		var configHtml = "";
		for (var j = 0; j < up_pageObj.data.android_downLink.length; j++) {
			configHtml += `
		'${up_pageObj.data.app_hostname[j]}':{
			androidDownload: '${up_pageObj.data.android_downLink[j]}',
			iosDownload: '${up_pageObj.data.ios_downLink[j]}',
			copyright: '${up_pageObj.data.app_copyright[j]}',
			copyright_logo: '${up_pageObj.data.copyright_logo[j]}'
		},
		`;
		}

		//判断是否有别名
		let bookAliasDisplay = ""
		if (up_pageObj.data.bookAlias == "" || up_pageObj.data.bookAlias == "无") {
			bookAliasDisplay = "none";
		} else {
			bookAliasDisplay = "block";
		}
		//重新写入index.html
		var htmlstr = fs.readFileSync('./modle_html/template1/template_1.text', {
			encoding: 'utf8'
		});
		if (up_pageObj.data.logos == 1) {
			htmlstr = htmlstr
				.replace(/{{app_logo}}/g, up_pageObj.data.logo)
				.replace(/{{app_android_logo}}/g, '')
				.replace(/{{app_ios_logo}}/g, '')

		} else {
			htmlstr = htmlstr
				.replace(/{{app_logo}}/g, '')
				.replace(/{{app_android_logo}}/g, up_pageObj.data.androidLogo)
				.replace(/{{app_ios_logo}}/g, up_pageObj.data.iosLogo)
		}
		if (up_pageObj.data.names == 1) {
			htmlstr = htmlstr
				.replace(/{{appName}}/g, up_pageObj.data.appNames)
				.replace(/{{android_appName}}/g, '')
				.replace(/{{ios_appName}}/g, '')

		} else {
			htmlstr = htmlstr
				.replace(/{{appName}}/g, '')
				.replace(/{{android_appName}}/g, up_pageObj.data.androidAppName)
				.replace(/{{ios_appName}}/g, up_pageObj.data.iosAppName)
		}

		htmlstr = htmlstr
			.replace(/{{bookFace}}/g, up_pageObj.data.cover)
			.replace(/{{pageName}}/g, up_pageObj.data.pageNum)
			.replace(/{{appName}}/g, up_pageObj.data.app_Name)
			.replace(/{{appAd}}/g, up_pageObj.data.appAd)
			.replace(/{{bookNum}}/g, up_pageObj.data.bookNum)
			.replace(/{{bookName}}/g, up_pageObj.data.bookName)
			.replace(/{{bookAlias}}/g, up_pageObj.data.bookAlias)
			.replace(/{{bookAliasDisplay}}/g, bookAliasDisplay)
			.replace(/{{bookAuthor}}/g, up_pageObj.data.bookAuthor)
			.replace(/{{bookState}}/g, up_pageObj.data.bookState == 0?'完结':'连载中')
			.replace(/{{bookFans}}/g, up_pageObj.data.bookFans)
			.replace(/{{bookStyle}}/g, up_pageObj.data.bookStyle)
			.replace(/{{bookIntroduce}}/g, up_pageObj.data.bookIntroduce)
			.replace(/{{latestChapter}}/g, up_pageObj.data.latestChapter)
			.replace(/{{bookDown}}/g, up_pageObj.data.bookDown)
			.replace(/{{config}}/g, configHtml)
			.replace(/{{android_downLink}}/g, up_pageObj.data.android_downLink[0])
			.replace(/{{ios_downLink}}/g, up_pageObj.data.ios_downLink[0])
			.replace(/{{copyright}}/g, up_pageObj.data.app_copyright[0])
			.replace(/{{copyright_logo}}/g, up_pageObj.data.copyright_logo[0])
		// console.log(htmlstr)
		//写入index文件
		fs.writeFileSync(globalConfig.GetLandPath(channel, appName, pageName, 'index.html'), htmlstr);
		
		//截图
		var html_img = globalConfig.GetHostUrl() + globalConfig.UrlJoin("/pages", channel, appName, pageName, 'index.html')
		var paths = globalConfig.GetLandPath(channel, appName, pageName, 'remove.jpeg');
		funMethod.puppeteerToScreenshot(html_img, paths);
		
		//完成更新
		res.send('ok');

	} else { //来自新建与修改
		var modles_obj = req.query;
		var channelName = modles_obj.channelName;
		var appName = modles_obj.appName;
		var pageName = modles_obj.pageNum; //落地页号
		var oldImg_arr = []; //旧图片信息
		var pages_imgs = []; //图片信息
		/*=================================================*/
		//查询落地页号是否存在
		if (fs.existsSync(globalConfig.GetLandPath(channelName, appName, pageName))) {
			console.log('落地页文件夹已存在');
			//获取之前的图片信息
			var data = fs.readFileSync(globalConfig.GetLandPath(channelName, appName, pageName, 'package.json'));
			var datas = JSON.parse(data.toString());
			console.log(datas);
			let objs = {
				androidLogo: datas.data.androidLogo,
				iosLogo: datas.data.iosLogo,
				cover: datas.data.cover,
				logo: datas.data.logo,
				copyright_logo: datas.data.copyright_logo
			}
			oldImg_arr.push(objs);

		} else {
			console.log('落地页文件夹不存在');
			//创建落地页文件夹
			funMethod.mkdirsSync(globalConfig.GetLandPath(channelName, appName, pageName));
			//创建落地页文件夹图片
			funMethod.mkdirsSync(globalConfig.GetLandPath(channelName, appName, pageName, 'imgs'));
		}

		//新建表单数据
		var form = new multiparty.Form(); //新建表单
		form.uploadDir = globalConfig.GetLandPath(channelName, appName, pageName, 'imgs'); //设置图片存储路径
		form.encoding = 'utf-8'; //设置编码
		form.keepExtensions = true; //保留后缀
		form.maxFieldsSize = 4 * 1024 * 1024; //内存大小
		form.maxFilesSize = 10 * 1024 * 1024; //文件字节大小限制，超出会报错err

		//处理表单数据
		form.parse(req, function (err, fields, files) {
			// //解析表单得图片内容
			console.log(files,fields);
			//报错处理
			if (err) {
				console.log(err);
				var u = {
					"error": 3,
					"message": 'error from imgurl'
				};
				res.end(JSON.stringify(u));
				return false;
			}

			//图片处理
			if (fields.logos[0] == 1) {
				//处理统一的logo图片
				if (files.app_logo[0].size > 0) {
					var imgLogo = files.app_logo[0].path;
					// var imgs = funMethod.PictureFormat(imgLogo, globalConfig.GetLandPath(channelName, appName, pageName));
					let logo = imgLogo.split('/');
					pages_imgs.push(logo[logo.length - 1]);
				} else {
					pages_imgs.push(oldImg_arr[0].logo);
				}
			} else {
				//处理安卓的logo
				if (files.android_logo[0].size > 0) {
					var androidLogo = files.android_logo[0].path;
					// var imgs = funMethod.PictureFormat(androidLogo, globalConfig.GetLandPath(channelName, appName, pageName));
					let logo = androidLogo.split('/');
					pages_imgs.push(logo[logo.length - 1]);
				} else {
					pages_imgs.push(oldImg_arr[0].androidLogo);
				}
				//处理iOS的logo
				if (files.ios_logo[0].size > 0) {
					var iosLogo = files.ios_logo[0].path;
					// var imgs = funMethod.PictureFormat(iosLogo, globalConfig.GetLandPath(channelName, appName, pageName));
					let logo = iosLogo.split('/');
					pages_imgs.push(logo[logo.length - 1]);
				} else {
					pages_imgs.push(oldImg_arr[0].iosLogo);	
				}
			}
			//处理face图片
			if (files.bookFace[0].size > 0) {
				var imgface = files.bookFace[0].path;
				// var imgs = funMethod.PictureFormat(imgface, globalConfig.GetLandPath(channelName, appName, pageName));
				let face = imgface.split('/');
				pages_imgs.push(face[face.length - 1]);
			} else {
				pages_imgs.push(oldImg_arr[0].cover);
			}

			//处理版权logo
			let logoArr = [];
			for(let i = 0 ; i < files.copyright_logo.length; i++){
				if(files.copyright_logo[i].size > 0){
				   let logoPath = files.copyright_logo[i].path;
				  //  let imgs = funMethod.PictureFormat(logoPath, globalConfig.GetLandPath(channelName, appName, pageName));
				   let logos = logoPath.split('/');
				   logoArr.push(logos[logos.length-1])
				}else{
					logoArr.push(oldImg_arr[0].copyright_logo && oldImg_arr[0].copyright_logo[i] || "")
					// for(let i = 0; i < oldImg_arr[0].copyright_logo.length; i++){
					// 	logoArr.push(oldImg_arr[0].copyright_logo[i])
					// }
				}
		   }
			console.log(pages_imgs);

			// //解析表单得文字内容
			console.log(fields);
			pages_info_obj = {
				"channelName": channelName,
				"appName": appName,
				"pageNum": pageName,
				"logos": fields.logos[0]?fields.logos[0]:'',
				"names": fields.names[0]?fields.names[0]:'',
				"config_num": fields.app_hostname.length,
				"appAd": fields.appAd[0]?fields.appAd[0]:'',
				"bookName": fields.bookName[0]?fields.bookName[0]:'',
				"bookAlias": fields.bookAlias[0]?fields.bookAlias[0]:'',
				"bookAuthor": fields.bookAuthor[0]?fields.bookAuthor[0]:'',
				"bookState": fields.bookState[0]?fields.bookState[0]:'',
				"bookFans": fields.bookFans[0]?fields.bookFans[0]:'',
				"bookStyle": fields.bookStyle[0]?fields.bookStyle[0]:'',
				"bookNum": fields.bookNum[0]?fields.bookNum[0]:'',
				"latestChapter": fields.latestChapter[0]?fields.latestChapter[0]:'',
				"bookIntroduce": fields.bookIntroduce[0]?fields.bookIntroduce[0]:'',
				"bookDown": fields.bookDown[0]?fields.bookDown[0]:'',
				"android_downLink": fields.android_downLink,
				"ios_downLink": fields.ios_downLink,
				"app_hostname": fields.app_hostname,
				"app_copyright": fields.app_copyright,
				"copyright_logo": logoArr
			}
			if (fields.logos[0] == 1) {
				pages_info_obj.logo = pages_imgs[0];
				pages_info_obj.cover = pages_imgs[1];
				//删除imgs里除用的多余文件
				let imgFiles = fs.readdirSync(globalConfig.GetLandPath(channelName, appName, pageName, "imgs"));
				for (var i = 0; i < imgFiles.length; i++) {
					var newlogo = pages_imgs[0];
					var newcover = pages_imgs[1];
					for(let j = 0; j < pages_info_obj.copyright_logo.length; j++){
						if (imgFiles[i] == newlogo || imgFiles[i] == newcover || imgFiles[i] == pages_info_obj.copyright_logo[j]) {
							console.log(imgFiles[i]);
						} else {
							try {
								fs.unlinkSync(globalConfig.GetLandPath(channelName, appName, pageName, "imgs", imgFiles[i]));
							} catch (error) {
								console.log(error)
							}
						}
					}
				}
			} else {
				pages_info_obj.androidLogo = pages_imgs[0];
				pages_info_obj.iosLogo = pages_imgs[1];
				pages_info_obj.cover = pages_imgs[2];
				//删除imgs里除用的多余文件
				let imgFiles = fs.readdirSync(globalConfig.GetLandPath(channelName, appName, pageName, "imgs"));
				for (var i = 0; i < imgFiles.length; i++) {
					var newAndroidLogo = pages_imgs[0];
					var newIosLogo = pages_imgs[1];
					var newcover = pages_imgs[2];
					for(let j = 0; j < pages_info_obj.copyright_logo.length; j++){
						if (imgFiles[i] == newAndroidLogo || imgFiles[i] == newIosLogo || imgFiles[i] == newcover || imgFiles[i] == pages_info_obj.copyright_logo[j]) {
							console.log(imgFiles[i]);
						} else {
							try {
								fs.unlinkSync(globalConfig.GetLandPath(channelName, appName, pageName, "imgs", imgFiles[i]));
							} catch (error) {
								console.log(error)
							}
						}
					}
				}
			}

			//app名字
			if(fields.names[0] == 1){
				pages_info_obj.appNames = fields.appName[0]
			}else{
				pages_info_obj.androidAppName = fields.android_appName[0];
				pages_info_obj.iosAppName = fields.ios_appName[0]
			}

			//最终的对象
			var finalObj
			try {
				finalObj = fs.readFileSync("./modle_html/template1/package.json", {
					encoding: 'utf8'
				});
				finalObj = JSON.parse(finalObj);
			} catch (error) {
				throw '读取模板的package.josn出错，请检查';
			}
			finalObj.data = pages_info_obj;

			//写入json
			fs.writeFileSync(globalConfig.GetLandPath(channelName, appName, pageName, 'package.json'), JSON.stringify(finalObj));


			//循环复制图片
			let localImgArr = fs.readdirSync('./modle_html/template1/imgs');
			for (let i = 0; i < localImgArr.length; i++) {
				if (localImgArr[i] != '2019-06-13 15.02.11.jpg' && localImgArr[i] != 'avatar.jpg') {
					// console.log(globalConfig.GetLandPath(channelName, appName, pageName, "imgs", localImgArr[i]))
					funMethod.copyPicture('./modle_html/template1/imgs/' + localImgArr[i], globalConfig.GetLandPath(channelName, appName, pageName, "imgs", localImgArr[i]));
				}
			}

			//循环生成配置
			var configHtml = "";
			for (var j = 0; j < fields.android_downLink.length; j++) {
				configHtml += `
			'${fields.app_hostname[j]}':{
				androidDownload: '${fields.android_downLink[j]}',
				iosDownload: '${fields.ios_downLink[j]}',
				copyright: '${fields.app_copyright[j]}',
				copyright_logo: '${finalObj.data.copyright_logo[j]}'
			},
			`;
			}

			//判断是否有别名
			let bookAliasDisplay = ""
			if (fields.bookAlias[0] == "" || fields.bookAlias[0] == "无") {
				bookAliasDisplay = "none";
			} else {
				bookAliasDisplay = "block";
			}


			//写入html文件
			var htmlstr = fs.readFileSync('./modle_html/template1/template_1.text', {
				encoding: 'utf8'
			});
			if (fields.logos[0] == 1) {
				htmlstr = htmlstr
					.replace(/{{app_logo}}/g, finalObj.data.logo)
					.replace(/{{app_android_logo}}/g, '')
					.replace(/{{app_ios_logo}}/g, '')

			} else {
				htmlstr = htmlstr
					.replace(/{{app_logo}}/g, '')
					.replace(/{{app_android_logo}}/g, finalObj.data.androidLogo)
					.replace(/{{app_ios_logo}}/g, finalObj.data.iosLogo)
			}

			if (fields.names[0] == 1) {
				htmlstr = htmlstr
					.replace(/{{appName}}/g, finalObj.data.appNames)
					.replace(/{{android_appName}}/g, '')
					.replace(/{{ios_appName}}/g, '')

			} else {
				htmlstr = htmlstr
					.replace(/{{appName}}/g, '')
					.replace(/{{android_appName}}/g, finalObj.data.androidAppName)
					.replace(/{{ios_appName}}/g, finalObj.data.iosAppName)
			}

			htmlstr = htmlstr
				.replace(/{{bookFace}}/g, finalObj.data.cover)
				.replace(/{{pageName}}/g, finalObj.data.pageNum)
				.replace(/{{appName}}/g, finalObj.data.app_Name)
				.replace(/{{appAd}}/g, finalObj.data.appAd)
				.replace(/{{bookNum}}/g, finalObj.data.bookNum)
				.replace(/{{bookName}}/g, finalObj.data.bookName)
				.replace(/{{bookAlias}}/g, finalObj.data.bookAlias)
				.replace(/{{bookAliasDisplay}}/g, bookAliasDisplay)
				.replace(/{{bookAuthor}}/g, finalObj.data.bookAuthor)
				.replace(/{{bookState}}/g, finalObj.data.bookState == 0?'完结':'连载中')
				.replace(/{{bookFans}}/g, finalObj.data.bookFans)
				.replace(/{{bookStyle}}/g, finalObj.data.bookStyle)
				.replace(/{{bookIntroduce}}/g, finalObj.data.bookIntroduce)
				.replace(/{{latestChapter}}/g, finalObj.data.latestChapter)
				.replace(/{{bookDown}}/g, fields.bookDown[0])
				.replace(/{{config}}/g, configHtml)
				.replace(/{{android_downLink}}/g, fields.android_downLink[0])
				.replace(/{{ios_downLink}}/g, fields.ios_downLink[0])
				.replace(/{{copyright}}/g, fields.app_copyright[0])
				.replace(/{{copyright_logo}}/g, logoArr[0]);

			// console.log(htmlstr)

			//写入index文件
			fs.writeFileSync(globalConfig.GetLandPath(channelName, appName, pageName, 'index.html'), htmlstr);

			//重定向
			res.redirect(302, globalConfig.UrlJoin("/pages", channelName, appName, pageName, 'index.html'));
			
			//截图
			var html_img = globalConfig.GetHostUrl() + globalConfig.UrlJoin("/pages", channelName, appName, pageName, 'index.html');
			var paths = globalConfig.GetLandPath(channelName, appName, pageName, 'remove.jpeg');
			funMethod.puppeteerToScreenshot(html_img, paths);
		})
	}
});
/*模板二*/
router.post('/modles2', function (req, res) {
	if (req.headers.referer.includes('historyPage')) {
		// 拿到模板号
		var pageName = req.body.pageNum;
		var appName = req.body.appName;
		var channel = req.body.channel;
		funMethod.updatas(globalConfig.GetLandPath(channel, appName, pageName, 'package.json'));
		//读取该落地页的json
		let up_pageObj = fs.readFileSync(globalConfig.GetLandPath(channel, appName, pageName, 'package.json'), {
			encoding: 'utf8'
		});
		up_pageObj = JSON.parse(up_pageObj);
		//重新写入index.html
		//循环生成配置
		var configHtml = "";
		for (var j = 0; j < up_pageObj.data.config_num; j++) {
			configHtml += `
		'${up_pageObj.data.app_hostname[j]}':{
			androidDownload: '${up_pageObj.data.android_downLink[j]}',
			iosDownload: '${up_pageObj.data.ios_downLink[j]}',
			copyright: '${up_pageObj.data.app_copyright[j]}',
			copyright_logo: '${up_pageObj.data.copyright_logo[j]}'
		},
		`;
		}
		var htmlstr = fs.readFileSync('./modle_html/template2/template_2.text', {
			encoding: 'utf8'
		});
		var chapterstr = htmlstr.match(/{{%forEach in chapter%}}([\s\S]*?){{%forEach%}}/)[1]
		var chapterHtml = "";
		for (var i = 0; i < up_pageObj.data.chapter_num; i++) {
			chapterHtml += chapterstr.replace("{{chapter_name}}", up_pageObj.data.chapter_name[i])
				.replace("{{chapter_content}}", up_pageObj.data.chapter_content[i])
				.replace("{{show}}", i != up_pageObj.data.chapter_name - 1 ? "block" : "none")
		}
		if (up_pageObj.data.logos == 1) {
			htmlstr = htmlstr
				.replace(/{{app_logo}}/g, up_pageObj.data.logo)
				.replace(/{{app_android_logo}}/g, '')
				.replace(/{{app_ios_logo}}/g, '')

		} else {
			htmlstr = htmlstr
				.replace(/{{app_logo}}/g, '')
				.replace(/{{app_android_logo}}/g, up_pageObj.data.androidLogo)
				.replace(/{{app_ios_logo}}/g, up_pageObj.data.iosLogo)
		}
		if (up_pageObj.data.names == 1) {
			htmlstr = htmlstr
				.replace(/{{appName}}/g, up_pageObj.data.appNames)
				.replace(/{{android_appName}}/g, '')
				.replace(/{{ios_appName}}/g, '')

		} else {
			htmlstr = htmlstr
				.replace(/{{appName}}/g, '')
				.replace(/{{android_appName}}/g, up_pageObj.data.androidAppName)
				.replace(/{{ios_appName}}/g, up_pageObj.data.iosAppName)
		}
		htmlstr = htmlstr
			.replace(/{{chapter_num}}/g, up_pageObj.data.chapter_name)
			.replace(/{{book_name}}/g, up_pageObj.data.book_name)
			.replace(/{{book_introduce}}/g, up_pageObj.data.book_introduce)
			.replace(/{{app_name}}/g, up_pageObj.data.app_name)
			.replace(/{{app_downNum}}/g, up_pageObj.data.app_downNum)
			.replace(/{{book_info}}/g, up_pageObj.data.book_info)
			.replace(/{{app_down}}/g, up_pageObj.data.app_down)
			.replace(/{{app_copyright}}/g, up_pageObj.data.app_copyright)
			.replace(/{{app_logo}}/g, up_pageObj.data.logo)
			.replace(/{{book_imgs}}/g, up_pageObj.data.cover)
			.replace(/{{%forEach in chapter%}}[\s\S]*?{{%forEach%}}/g, chapterHtml)
			.replace(/{{config}}/g, configHtml)
			.replace(/{{android_downLink}}/g, up_pageObj.data.android_downLink[0])
			.replace(/{{ios_downLink}}/g, up_pageObj.data.ios_downLink[0])
			.replace(/{{copyright}}/g, up_pageObj.data.app_copyright[0])
			.replace(/{{copyright_logo}}/g, up_pageObj.data.copyright_logo[0])
		// console.log(htmlstr)

		//写入index文件
		fs.writeFileSync(globalConfig.GetLandPath(channel, appName, pageName, 'index.html'), htmlstr);

		//截图
		var html_img = globalConfig.GetHostUrl() + globalConfig.UrlJoin("/pages", channel, appName, pageName, 'index.html')
		var paths = globalConfig.GetLandPath(channel, appName, pageName, 'remove.jpeg');
		funMethod.puppeteerToScreenshot(html_img, paths);

		//完成更新
		res.send('ok');

	} else {
		var modles_obj = req.query;
		var channelName = modles_obj.channelName;
		var appName = modles_obj.appName;
		var pageName = modles_obj.pageNum; //落地页号
		var oldImg_arr = []; //旧图片信息
		var pages_imgs = []; //图片信息
		/*=================================================*/
		//查询落地页号是否存在
		if (fs.existsSync(globalConfig.GetLandPath(channelName, appName, pageName))) {
			console.log('落地页文件夹已存在');
			//获取之前的图片信息
			var data = fs.readFileSync(globalConfig.GetLandPath(channelName, appName, pageName, 'package.json'));
			var datas = JSON.parse(data.toString());
			console.log(datas);
			let objs = {
				androidLogo: datas.data.androidLogo,
				iosLogo: datas.data.iosLogo,
				cover: datas.data.cover,
				logo: datas.data.logo,
				copyright_logo: datas.data.copyright_logo
			}

			oldImg_arr.push(objs);
		} else {
			oldImg_arr.push({
				androidLogo: "",
				iosLogo: "",
				cover: "",
				logo: "",
				copyright_logo: ""
			});
			console.log('落地页文件夹不存在');
			//创建落地页文件夹
			funMethod.mkdirsSync(globalConfig.GetLandPath(channelName, appName, pageName));
			//创建落地页文件夹图片
			funMethod.mkdirsSync(globalConfig.GetLandPath(channelName, appName, pageName, 'imgs'));
		}
		//新建表单数据
		var form = new multiparty.Form(); //新建表单
		form.uploadDir = globalConfig.GetLandPath(channelName, appName, pageName, "imgs"); //设置图片存储路径
		form.encoding = 'utf-8'; //设置编码
		form.keepExtensions = true; //保留后缀
		form.maxFieldsSize = 4 * 1024 * 1024; //内存大小
		form.maxFilesSize = 10 * 1024 * 1024; //文件字节大小限制，超出会报错err

		//处理表单数据
		form.parse(req, function (err, fields, files) {
			//解析表单得图片内容
			console.log(files,fields);
			//报错处理
			if (err) {
				console.log(err);
				var u = {
					"error": 3,
					"message": 'error from imgurl'
				};
				res.end(JSON.stringify(u));
				return false;
			}

			//图片处理
			if (fields.logos[0] == 1) {
				//处理统一的logo图片
				if (files.app_logo[0].size > 0) {
					var imgLogo = files.app_logo[0].path;
					// var imgs = funMethod.PictureFormat(imgLogo, globalConfig.GetLandPath(channelName, appName, pageName));
					let logo = imgLogo.split('/');
					pages_imgs.push(logo[logo.length - 1]);
				} else {
					pages_imgs.push(oldImg_arr[0].logo);
				}
			} else {
				//处理安卓的logo
				if (files.android_logo[0].size > 0) {
					var androidLogo = files.android_logo[0].path;
					// var imgs = funMethod.PictureFormat(androidLogo, globalConfig.GetLandPath(channelName, appName, pageName));
					let logo = androidLogosplit('/');
					pages_imgs.push(logo[logo.length - 1]);
				} else {
					pages_imgs.push(oldImg_arr[0].androidLogo);
				}
				//处理iOS的logo
				if (files.ios_logo[0].size > 0) {
					var iosLogo = files.ios_logo[0].path;
					// var imgs = funMethod.PictureFormat(iosLogo, globalConfig.GetLandPath(channelName, appName, pageName));
					let logo = iosLogo.split('/');
					pages_imgs.push(logo[logo.length - 1]);
				} else {
					pages_imgs.push(oldImg_arr[0].iosLogo);
				}


			}
			//处理face图片
			if (files.book_imgs[0].size > 0) {
				var imgface = files.book_imgs[0].path;
				var imgs = funMethod.PictureFormat(imgface, globalConfig.GetLandPath(channelName, appName, pageName));
				let face = imgs.url.split('/');
				pages_imgs.push(face[face.length - 1]);
			} else {
				pages_imgs.push(oldImg_arr[0].cover);
			}
			//处理版权logo
			let logoArr = [];
			for(let i = 0 ; i < files.copyright_logo.length; i++){
				if(files.copyright_logo[i].size > 0){
				   let logoPath = files.copyright_logo[i].path;
				  //  let imgs = funMethod.PictureFormat(logoPath, globalConfig.GetLandPath(channelName, appName, pageName));
				   let logos = logoPath.split('/');
				   logoArr.push(logos[logos.length-1])
				}else{
					logoArr.push(oldImg_arr[0].copyright_logo && oldImg_arr[0].copyright_logo[i] || "")
					// for(let i = 0; i < oldImg_arr[0].copyright_logo.length; i++){
					// 	logoArr.push(oldImg_arr[0].copyright_logo[i])
					// }
				}
		   }

			console.log(oldImg_arr);

			//解析表单得文字内容
			console.log(fields);
			pages_info_obj = {
				"channelName": channelName,
				"appName": appName,
				"pageNum": pageName,
				"logos": fields.logos[0]?fields.logos[0]:'',
				"names": fields.names[0]?fields.names[0]:'',
				"book_name": fields.book_name[0]?fields.book_name[0]:'',
				"book_introduce": fields.book_introduce[0]?fields.book_introduce[0]:'',
				"app_downNum": fields.app_downNum[0]?fields.app_downNum[0]:'',
				"chapter_num": fields.chapter_name.length,
				"chapter_name": fields.chapter_name,
				"chapter_content": fields.chapter_content,
				"book_info": fields.book_info[0]?fields.book_info[0]:'',
				"app_down": fields.app_down[0]?fields.app_down[0]:'',
				"config_num": fields.android_downLink.length,
				"android_downLink": fields.android_downLink,
				"ios_downLink": fields.ios_downLink,
				"app_hostname": fields.app_hostname,
				"app_copyright": fields.app_copyright,
				"copyright_logo": logoArr
			}

			if (fields.logos[0] == 1) {
				pages_info_obj.logo = pages_imgs[0];
				pages_info_obj.cover = pages_imgs[1];
				//删除imgs里除用的多余文件
				let imgFiles = fs.readdirSync(globalConfig.GetLandPath(channelName, appName, pageName, "imgs"));
				for (var i = 0; i < imgFiles.length; i++) {
					var newlogo = pages_imgs[0];
					var newcover = pages_imgs[1];
					for(let j = 0; j < pages_info_obj.copyright_logo.length; j++){
						if (imgFiles[i] == newlogo || imgFiles[i] == newcover || imgFiles[i]== pages_info_obj.copyright_logo[j]) {
							console.log(imgFiles[i]);
						} else {
							fs.unlinkSync(globalConfig.GetLandPath(channelName, appName, pageName, "imgs", imgFiles[i]));
						}
					}
					
				}
			} else {
				pages_info_obj.androidLogo = pages_imgs[0];
				pages_info_obj.iosLogo = pages_imgs[1];
				pages_info_obj.cover = pages_imgs[2];
				//删除imgs里除用的多余文件
				let imgFiles = fs.readdirSync(globalConfig.GetLandPath(channelName, appName, pageName, "imgs"));
				for (var i = 0; i < imgFiles.length; i++) {
					var newAndroidLogo = pages_imgs[0];
					var newIosLogo = pages_imgs[1];
					var newcover = pages_imgs[2];
					for(let j = 0; j < pages_info_obj.copyright_logo.length; j++){
						if (imgFiles[i] == newAndroidLogo || imgFiles[i] == newIosLogo || imgFiles[i] == newcover || imgFiles[i]== pages_info_obj.copyright_logo[j]) {
							console.log(imgFiles[i]);
						} else {
							fs.unlinkSync(globalConfig.GetLandPath(channelName, appName, pageName, "imgs", imgFiles[i]));
						}
					}
					
				}
			}

			//app名字
			if(fields.names[0] == 1){
				pages_info_obj.appNames = fields.appName[0]
			}else{
				pages_info_obj.androidAppName = fields.android_appName[0];
				pages_info_obj.iosAppName = fields.ios_appName[0]
			}


			//最终的对象
			var finalObj
			try {
				finalObj = fs.readFileSync("./modle_html/template2/package.json", {
					encoding: 'utf8'
				});
				finalObj = JSON.parse(finalObj);
			} catch (error) {
				throw '读取模板的package.josn出错，请检查';
			}
			finalObj.data = pages_info_obj;

			
			//写入json
			fs.writeFileSync(globalConfig.GetLandPath(channelName, appName, pageName, 'package.json'), JSON.stringify(finalObj));

			//循环复制图片
			let localImgArr = fs.readdirSync('./modle_html/template2/imgs');
			for (let i = 0; i < localImgArr.length; i++) {
				if (localImgArr[i] != 'banner.jpg' && localImgArr[i] != 'logo.png') {
					funMethod.copyPicture('./modle_html/template2/imgs/' + localImgArr[i], globalConfig.GetLandPath(channelName, appName, pageName, "imgs", localImgArr[i]));
				}
			}

			//循环生成配置
			var configHtml = "";
			for (var j = 0; j < fields.android_downLink.length; j++) {
				configHtml += `
			'${fields.app_hostname[j]}':{
				androidDownload: '${fields.android_downLink[j]}',
				iosDownload: '${fields.ios_downLink[j]}',
				copyright: '${fields.app_copyright[j]}',
				copyright_logo: '${finalObj.data.copyright_logo[j]}'
			},
			`;
			}


			var app_info = finalObj.data.app_downLink + ',' + finalObj.data.app_hostname;
			//写入index.html
			var htmlstr = fs.readFileSync('./modle_html/template2/template_2.text', {
				encoding: 'utf8'
			});
			var chapterstr = htmlstr.match(/{{%forEach in chapter%}}([\s\S]*?){{%forEach%}}/)[1]
			var chapterHtml = "";
			for (var i = 0; i < fields.chapter_name.length; i++) {
				chapterHtml += chapterstr.replace("{{chapter_name}}", fields.chapter_name[i])
					.replace("{{chapter_content}}", fields.chapter_content[i])
					.replace("{{show}}", i != fields.chapter_name.length - 1 ? "block" : "none")
			}
			if (fields.logos[0] == 1) {
				htmlstr = htmlstr
					.replace(/{{app_logo}}/g, finalObj.data.logo)
					.replace(/{{app_android_logo}}/g, '')
					.replace(/{{app_ios_logo}}/g, '')

			} else {
				htmlstr = htmlstr
					.replace(/{{app_logo}}/g, '')
					.replace(/{{app_android_logo}}/g, finalObj.data.androidLogo)
					.replace(/{{app_ios_logo}}/g, finalObj.data.iosLogo)
			}

			if (fields.names[0] == 1) {
				htmlstr = htmlstr
					.replace(/{{appName}}/g, finalObj.data.appNames)
					.replace(/{{android_appName}}/g, '')
					.replace(/{{ios_appName}}/g, '')

			} else {
				htmlstr = htmlstr
					.replace(/{{appName}}/g, '')
					.replace(/{{android_appName}}/g, finalObj.data.androidAppName)
					.replace(/{{ios_appName}}/g, finalObj.data.iosAppName)
			}

			htmlstr = htmlstr
				.replace(/{{chapter_num}}/g, fields.chapter_name.length)
				.replace(/{{book_name}}/g, finalObj.data.book_name)
				.replace(/{{book_introduce}}/g, finalObj.data.book_introduce)
				.replace(/{{app_name}}/g, finalObj.data.appName)
				.replace(/{{app_downNum}}/g, finalObj.data.app_downNum)
				.replace(/{{book_info}}/g, finalObj.data.book_info)
				.replace(/{{app_down}}/g, finalObj.data.app_down)
				.replace(/{{app_copyright}}/g, finalObj.data.app_copyright)
				.replace(/{{app_info}}/g, app_info)
				.replace(/{{app_logo}}/g, finalObj.data.logo)
				.replace(/{{book_imgs}}/g, finalObj.data.cover)
				.replace(/{{%forEach in chapter%}}[\s\S]*?{{%forEach%}}/g, chapterHtml)
				.replace(/{{config}}/g, configHtml)
				.replace(/{{android_downLink}}/g, fields.android_downLink[0])
				.replace(/{{ios_downLink}}/g, fields.ios_downLink[0])
				.replace(/{{copyright}}/g, fields.app_copyright[0])
				.replace(/{{copyright_logo}}/g, logoArr[0]);

			// console.log(htmlstr)

			//写入index文件
			fs.writeFileSync(globalConfig.GetLandPath(channelName, appName, pageName, 'index.html'), htmlstr);
			//重定向
			res.redirect(302, globalConfig.UrlJoin("/pages", channelName, appName, pageName, 'index.html'));

			//截图
			var html_img = globalConfig.GetHostUrl() + globalConfig.UrlJoin("/pages", channelName, appName, pageName, 'index.html')
			var paths = globalConfig.GetLandPath(channelName, appName, pageName, 'remove.jpeg');
			funMethod.puppeteerToScreenshot(html_img, paths);
		})
	}
});
/*模板三*/
router.post('/modles3', function (req, res) {
	if (req.headers.referer.includes('historyPage')) {
		// 拿到模板号
		var pageName = req.body.pageNum;
		var appName = req.body.appName;
		var channel = req.body.channel;
		funMethod.updatas(globalConfig.GetLandPath(channel, appName, pageName, 'package.json'));
		//读取该落地页的json
		let up_pageObj = fs.readFileSync(globalConfig.GetLandPath(channel, appName, pageName, 'package.json'), {
			encoding: 'utf8'
		});
		up_pageObj = JSON.parse(up_pageObj);
		//循环生成配置
		var configHtml = "";
		for (var j = 0; j < up_pageObj.data.config_num; j++) {
			configHtml += `
			'${up_pageObj.data.app_hostname[j]}':{
				androidDownload: '${up_pageObj.data.android_downLink[j]}',
				iosDownload: '${up_pageObj.data.ios_downLink[j]}',
				copyright: '${up_pageObj.data.app_copyright[j]}',
				copyright_logo: '${up_pageObj.data.copyright_logo[j]}'
			},
				`;
		}
		//写入html文件
		var htmlstr = fs.readFileSync('./modle_html/template3/template_3.text', {
			encoding: 'utf8'
		});
		if (up_pageObj.data.logos == 1) {
			htmlstr = htmlstr
				.replace(/{{app_logo}}/g, up_pageObj.data.logo)
				.replace(/{{app_android_logo}}/g, "")
				.replace(/{{app_ios_logo}}/g, "")
		} else {
			htmlstr = htmlstr
				.replace(/{{app_logo}}/g, "")
				.replace(/{{app_android_logo}}/g, up_pageObj.data.androidLogo)
				.replace(/{{app_ios_logo}}/g, up_pageObj.data.iosLogo)
		}
		if (up_pageObj.data.names == 1) {
			htmlstr = htmlstr
				.replace(/{{appName}}/g, up_pageObj.data.appNames)
				.replace(/{{android_appName}}/g, '')
				.replace(/{{ios_appName}}/g, '')

		} else {
			htmlstr = htmlstr
				.replace(/{{appName}}/g, '')
				.replace(/{{android_appName}}/g, up_pageObj.data.androidAppName)
				.replace(/{{ios_appName}}/g, up_pageObj.data.iosAppName)
		}
		htmlstr = htmlstr
			.replace(/{{app_downNum}}/g, up_pageObj.data.app_downNum)
			.replace(/{{android_version}}/g, up_pageObj.data.android_version)
			.replace(/{{ios_version}}/g, up_pageObj.data.ios_version)
			.replace(/{{config}}/g, configHtml)
			.replace(/{{android_downLink}}/g, up_pageObj.data.android_downLink[0])
			.replace(/{{ios_downLink}}/g, up_pageObj.data.ios_downLink[0])
			.replace(/{{copyright}}/g, up_pageObj.data.app_copyright[0])
			.replace(/{{copyright_logo}}/g, up_pageObj.data.copyright_logo[0])

		// console.log(htmlstr)
		//写入index文件
		fs.writeFileSync(globalConfig.GetLandPath(channel, appName, pageName, 'index.html'), htmlstr);
		//截图
		var html_img = globalConfig.GetHostUrl() + globalConfig.UrlJoin("/pages", channel, appName, pageName, 'index.html');
		var paths = globalConfig.GetLandPath(channel, appName, pageName, 'remove.jpeg')
		funMethod.puppeteerToScreenshot(html_img, paths);
		//完成更新
		res.send('ok');
	} else {
		var modles_obj = req.query;
		var channelName = modles_obj.channelName;
		var appName = modles_obj.appName;
		var pageName = modles_obj.pageNum; //落地页号

		var oldImg_arr = []; //旧图片信息
		var pages_imgs = []; //图片信息
		// console.log(pagePath);
		// console.log(pageNum_two)
		/*=================================================*/
		//查询落地页号是否存在
		if (fs.existsSync(globalConfig.GetLandPath(channelName, appName, pageName))) {
			console.log('落地页文件夹已存在');
			//获取之前的图片信息
			var data = fs.readFileSync(globalConfig.GetLandPath(channelName, appName, pageName, '/package.json'));
			var datas = JSON.parse(data.toString());
			console.log(datas);
			let objs = {
				androidLogo: datas.data.androidLogo,
				iosLogo: datas.data.iosLogo,
				logo: datas.data.logo,
				copyright_logo: datas.data.copyright_logo
			}
			oldImg_arr.push(objs);

		} else {
			console.log('落地页文件夹不存在');
			//创建落地页文件夹
			funMethod.mkdirsSync(globalConfig.GetLandPath(channelName, appName, pageName));
			//创建落地页文件夹图片
			funMethod.mkdirsSync(globalConfig.GetLandPath(channelName, appName, pageName, 'imgs'));
		}
		//新建表单数据
		var form = new multiparty.Form(); //新建表单
		form.uploadDir = globalConfig.GetLandPath(channelName, appName, pageName, 'imgs'); //设置图片存储路径
		form.encoding = 'utf-8'; //设置编码
		form.keepExtensions = true; //保留后缀
		form.maxFieldsSize = 4 * 1024 * 1024; //内存大小
		form.maxFilesSize = 10 * 1024 * 1024; //文件字节大小限制，超出会报错err
		//处理表单数据
		form.parse(req, function (err, fields, files) {
			//解析表单得图片内容
			console.log(files);
			//报错处理
			if (err) {
				console.log(err);
				var u = {
					"error": 3,
					"message": 'error from imgurl'
				};
				res.end(JSON.stringify(u));
				return false;
			}

			//图片处理
			if (fields.logos[0] == 1) {
				//处理统一的logo图片
				if (files.app_logo[0].size > 0) {
					var imgLogo = files.app_logo[0].path;
					// var imgs = funMethod.PictureFormat(imgLogo, globalConfig.GetLandPath(channelName, appName, pageName));
					let logo = imgLogo.split('/');
					pages_imgs.push(logo[logo.length - 1]);
				} else {
					pages_imgs.push(oldImg_arr[0].logo);
				}
			} else {
				//处理安卓的logo
				if (files.android_logo[0].size > 0) {
					var androidLogo = files.android_logo[0].path;
					// var imgs = funMethod.PictureFormat(androidLogo, globalConfig.GetLandPath(channelName, appName, pageName));
					let logo = androidLogo.split('/');
					pages_imgs.push(logo[logo.length - 1]);
				} else {
					pages_imgs.push(oldImg_arr[0].androidLogo);
				}
				//处理iOS的logo
				if (files.ios_logo[0].size > 0) {
					var iosLogo = files.ios_logo[0].path;
					// var imgs = funMethod.PictureFormat(iosLogo, globalConfig.GetLandPath(channelName, appName, pageName));
					let logo = iosLogo.split('/');
					pages_imgs.push(logo[logo.length - 1]);
				} else {
					pages_imgs.push(oldImg_arr[0].iosLogo);
				}
			}

			//处理版权logo
			let logoArr = [];
			for(let i = 0 ; i < files.copyright_logo.length; i++){
				if(files.copyright_logo[i].size > 0){
				   let logoPath = files.copyright_logo[i].path;
				  //  let imgs = funMethod.PictureFormat(logoPath, globalConfig.GetLandPath(channelName, appName, pageName));
				   let logos = logoPath.split('/');
				   logoArr.push(logos[logos.length-1])
				}else{
					logoArr.push(oldImg_arr[0].copyright_logo && oldImg_arr[0].copyright_logo[i] || "")
					// for(let i = 0; i < oldImg_arr[0].copyright_logo.length; i++){
					// 	logoArr.push(oldImg_arr[0].copyright_logo[i])
					// }
				}
		   }
			
			//解析表单得文字内容
			console.log(fields);
			pages_info_obj = {
				"channelName": channelName,
				"appName": appName,
				"pageNum": pageName,
				"logos": fields.logos[0]?fields.logos[0]:'',
				"names": fields.names[0]?fields.names[0]:'',
				"app_downNum": fields.app_downNum[0]?fields.app_downNum[0]:'',
				"android_version": fields.android_version[0]?fields.android_version[0]:'',
				"ios_version": fields.ios_version[0]?fields.ios_version[0]:'',
				"config_num": fields.android_downLink.length,
				"android_downLink": fields.android_downLink,
				"ios_downLink": fields.ios_downLink,
				"app_hostname": fields.app_hostname,
				"app_copyright": fields.app_copyright,
				"copyright_logo": logoArr
			}
			if (fields.logos[0] == 1) {
				pages_info_obj.logo = pages_imgs[0];
				//删除imgs里除用的多余文件
				imgFiles = fs.readdirSync(globalConfig.GetLandPath(channelName, appName, pageName, "imgs"));
				for (var i = 0; i < imgFiles.length; i++) {
					var newlogo = pages_imgs[0];
					for(let j = 0; j < pages_info_obj.copyright_logo.length; j++){
						if (imgFiles[i] == newlogo || imgFiles[i] == pages_info_obj.copyright_logo[j]) {
							console.log(imgFiles[i]);
						} else {
							fs.unlink(globalConfig.GetLandPath(channelName, appName, pageName, "imgs", imgFiles[i]), function (err) {
								if (err) throw err;
								console.log('文件已删除');
							});
						}
					}
					
				}
			} else {
				pages_info_obj.androidLogo = pages_imgs[0];
				pages_info_obj.iosLogo = pages_imgs[1];
				//删除imgs里除用的多余文件
				imgFiles = fs.readdirSync(globalConfig.GetLandPath(channelName, appName, pageName, "imgs"));
				for (var i = 0; i < imgFiles.length; i++) {
					var android_logo = pages_imgs[0];
					var ios_logo = pages_imgs[1];
					for(let j = 0; j < pages_info_obj.copyright_logo.length; j++){
						if (imgFiles[i] == android_logo || imgFiles[i] == ios_logo || imgFiles[i] == pages_info_obj.copyright_logo[j]) {
							console.log(imgFiles[i]);
						} else {
							fs.unlink(globalConfig.GetLandPath(channelName, appName, pageName, "imgs", imgFiles[i]), function (err) {
								if (err) throw err;
								console.log('文件已删除');
							});
						}
					}
					
				}
			}

			//app名字
			if(fields.names[0] == 1){
				pages_info_obj.appNames = fields.appName[0]
			}else{
				pages_info_obj.androidAppName = fields.android_appName[0];
				pages_info_obj.iosAppName = fields.ios_appName[0]
			}
			//最终的对象
			var finalObj
			try {
				finalObj = fs.readFileSync("./modle_html/template3/package.json", {
					encoding: 'utf8'
				});
				finalObj = JSON.parse(finalObj);
			} catch (error) {
				throw '读取模板的package.josn出错，请检查';
			}
			finalObj.data = pages_info_obj;

			//写入json
			fs.writeFileSync(globalConfig.GetLandPath(channelName, appName, pageName, 'package.json'), JSON.stringify(finalObj));

			//循环复制图片
			localImgArr = fs.readdirSync('./modle_html/template3/imgs');
			for (let i = 0; i < localImgArr.length; i++) {
				if (localImgArr[i] != 'logo.png') {
					funMethod.copyPicture('./modle_html/template3/imgs/' + localImgArr[i], globalConfig.GetLandPath(channelName, appName, pageName, "imgs", localImgArr[i]))
				}
			}

			//循环生成配置
			var configHtml = "";
			for (var j = 0; j < finalObj.data.config_num; j++) {
				configHtml += `
				'${finalObj.data.app_hostname[j]}':{
					androidDownload: '${finalObj.data.android_downLink[j]}',
					iosDownload: '${finalObj.data.ios_downLink[j]}',
					copyright: '${finalObj.data.app_copyright[j]}',
					copyright_logo: '${finalObj.data.copyright_logo[j]}'
				},
				`;
			}

			//写入html文件
			var htmlstr = fs.readFileSync('./modle_html/template3/template_3.text', {
				encoding: 'utf8'
			});
			if (fields.logos[0] == 1) {
				htmlstr = htmlstr
					.replace(/{{app_logo}}/g, finalObj.data.logo)
					.replace(/{{app_android_logo}}/g, '')
					.replace(/{{app_ios_logo}}/g, '')
			} else {
				htmlstr = htmlstr
					.replace(/{{app_logo}}/g, '')
					.replace(/{{app_android_logo}}/g, finalObj.data.androidLogo)
					.replace(/{{app_ios_logo}}/g, finalObj.data.iosLogo)
			}
			if (fields.names[0] == 1) {
				htmlstr = htmlstr
					.replace(/{{appName}}/g, finalObj.data.appNames)
					.replace(/{{android_appName}}/g, '')
					.replace(/{{ios_appName}}/g, '')

			} else {
				htmlstr = htmlstr
					.replace(/{{appName}}/g, '')
					.replace(/{{android_appName}}/g, finalObj.data.androidAppName)
					.replace(/{{ios_appName}}/g, finalObj.data.iosAppName)
			}
			htmlstr = htmlstr
				.replace(/{{app_downNum}}/g, finalObj.data.app_downNum)
				.replace(/{{android_version}}/g, finalObj.data.android_version)
				.replace(/{{ios_version}}/g, finalObj.data.ios_version)
				.replace(/{{config}}/g, configHtml)
				.replace(/{{android_downLink}}/g, fields.android_downLink[0])
				.replace(/{{ios_downLink}}/g, fields.ios_downLink[0])
				.replace(/{{copyright}}/g, fields.app_copyright[0])
				.replace(/{{copyright_logo}}/g, logoArr[0]);


			// console.log(htmlstr)

			//写入index文件
			fs.writeFileSync(globalConfig.GetLandPath(channelName, appName, pageName, 'index.html'), htmlstr);
			//重定向
			res.redirect(302, globalConfig.UrlJoin("/pages", channelName, appName, pageName, 'index.html'));
			
			//截图
			var html_img = globalConfig.GetHostUrl() + globalConfig.UrlJoin("/pages", channelName, appName, pageName, 'index.html');
			var paths = globalConfig.GetLandPath(channelName, appName, pageName, 'remove.jpeg');
			funMethod.puppeteerToScreenshot(html_img, paths);

		})
	}
});
module.exports = router;