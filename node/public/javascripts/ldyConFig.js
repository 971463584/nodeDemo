const ldyConFig = {
    indexUrl: "http://localhost:3000",//首页
    protNum: 3000,//端口
    newPageNum: "http://localhost:3000/newPage/newPage",//新建落地页模板页
    newFromPage: "http://localhost:3000/newFrom/newFrom?mouldNum=1",//新建落地页页表单页
    oldPageNum: "http://localhost:3000/oldPage/oldPage",//历史落地页
    pageFiles: "./pages",//落地页文件夹
    delPage: "http://localhost:3000/delFile/delFile",//删除落地页
    editPage: "http://localhost:3000/from/from",//修改落地页
    lookPage: 'http://localhost:3000/pages/' + look_pageNum + '/index.html',//查看落地页
}
module.exports = ldyConFig;