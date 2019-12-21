var globalConfig = require('./config/config')
var fs = require('fs')

var dirHandler = (path) => {
    let tree = {}
    fs.readdirSync(path).forEach(item => {
        if (item == ".DS_Store") return
        if (!fs.statSync(`${path}/${item}`).isDirectory()) return
        tree[item] = dirHandler(`${path}/${item}`)
    })
    return tree
}
let pages = globalConfig.landRootPath

allDirJson = dirHandler(pages)
Object.keys(allDirJson).forEach(channel => {
    console.log("渠道：", channel)
    let allAppName = allDirJson[channel]
    Object.keys(allAppName).forEach(appName => {
        console.log("包名：", appName)
        let allLdy = allAppName[appName]
        Object.keys(allLdy).forEach(ldyName => {
            if (fs.existsSync(globalConfig.GetLandPath(channel, appName, ldyName, 'package.json'))) {
                let obj = fs.readFileSync(globalConfig.GetLandPath(channel, appName, ldyName, 'package.json'));
                obj = JSON.parse(obj);
                if (obj.data.app_name) {
                    let names = obj.data.app_name
                    delete obj.data.app_name;
                    obj.data.appNames = names;
                    obj.data.names = "1";
                } else if (obj.data.app_Name) {
                    let names = obj.data.app_Name
                    delete obj.data.app_Name;
                    obj.data.appNames = names;
                    obj.data.names = "1";
                }
                if (!obj.data.config_num) {
                    console.log(`pages/${channel}/${appName}/${ldyName}/package.json`);
                    let nums = obj.data.app_copyright.length;
                    obj.data.config_num = nums;
                }
                if (!obj.data.copyright_logo) {
                    let logos = obj.data.app_copyright.length;
                    let arr = [];
                    for (let i = 0; i < logos; i++) {
                        arr.push('')
                    }
                    obj.data.copyright_logo = arr;
                }
                if (obj.data.bookState == '连载中') {
                    obj.data.bookState = "1"
                } else if (obj.data.bookState == '完结') {
                    obj.data.bookState = "0"
                }

                //再写回
                fs.writeFileSync(globalConfig.GetLandPath(channel, appName, ldyName, 'package.json'), JSON.stringify(obj));
            }
        })
    })
})