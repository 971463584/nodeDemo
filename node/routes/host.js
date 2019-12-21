var express = require('express');
var router = express.Router();
var fs = require('fs');
const { exec } = require('child_process');

/*新建域名*/
router.post('/newHost', function (req, res, next) {
    //拿到域名
    let newHost_val = req.body.newHost_val;
    let fileArr = fs.readdirSync('./vhost');
    let str = newHost_val + '.conf';
    for (let i = 0; i < fileArr.length; i++) {
        if (fileArr[i] == str) {
            return res.send('yes');
        }
    }
    //读取模板并写入
    let hostHtml = fs.readFileSync('./modle_html/host.text', {
        encoding: 'utf8'
    });
    hostHtml = hostHtml.replace(/{{host}}/g, newHost_val);
    fs.writeFileSync('./vhost/' + newHost_val + '.conf', hostHtml);//node
    // fs.writeFileSync('../../../../usr/local/nginx/conf/vhost/' + newHost_val + '.conf', hostHtml);//虚拟机
    // exec('/usr/local/nginx/sbin/nginx -t', (error, stdout, stderr) => {
    //     if (error) {
    //       console.error(`执行的错误: ${error}`);
    //       return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    //     console.error(`stderr: ${stderr}`);
    //   });
    res.send('ok');
});
/*域名列表*/
router.post('/hostList', function (req, res, next) {
    //读取域名列表
    let fileArr = fs.readdirSync('./vhost');//node
    // let fileArr = fs.readdirSync('../../../../usr/local/nginx/conf/vhost');//虚拟机
    let list = [];
    for (let i = 0; i < fileArr.length; i++) {
        let str = fileArr[i].substr('0', fileArr[i].lastIndexOf('.'));
        list.push(str)
    }
    res.send(list);

});
/*删除域名*/
router.post('/delHost', function (req, res, next) {
    let del_vla = req.body.del_vla;
    console.log(del_vla);
    let paths = './vhost/' + del_vla + '.conf';//node
    // let paths = '../../../../usr/local/nginx/conf/vhost/' + del_vla + '.conf';//虚拟机
    fs.unlinkSync(paths);
    res.send('ok');
});

router.post('/hostContent', function (req, res, next) {
    let deit_val = req.body.deit_val;
    let paths = './vhost/'+deit_val+'.conf';//node
    // let paths = '../../../../usr/local/nginx/conf/vhost/'+deit_val+'.conf';//虚拟机
    let hostHtml = fs.readFileSync(paths,{encoding: 'utf8'});
    res.send(hostHtml)
})

router.post('/editHost',function (req,res,next) {
    let oldHost = req.body.oldHost;
    let newHost = req.body.newHost;
    let newHostHtml = req.body.newHostHtml;
    //删除原来的文件
    let del_paths = './vhost/'+ oldHost+'.conf';//node
    // let del_paths = '../../../../usr/local/nginx/conf/vhost/' + oldHost + '.conf';//虚拟机
    fs.unlinkSync(del_paths);
    //新建并写入
    fs.writeFileSync('./vhost/' + newHost + '.conf', newHostHtml);//node
    // fs.writeFileSync('../../../../usr/local/nginx/conf/vhost/' + newHost + '.conf', newHostHtml);//虚拟机
    res.send('ok');
  })
module.exports = router;