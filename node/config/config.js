const isDev = process.argv.includes("dev")
const path = require("path")

const globalConfig = {
    isDev,
    host: '127.0.0.1', //域名
    port: 3000, //端口
    landRootPath: isDev ? `${process.cwd()}/pages` : "/data/web/ad/xs",
    GetLandPath: function (...args) {
        return this.landRootPath + "/" + path.join(...args.map(item => String(item)))
    },
    UrlJoin: function(...args) {
        return args.map((item, index) => {
            if (index) {
                return "/" + item
            } else {
                return item
            }
        }).join("")
    },
    GetHostUrl: function() {
        return `http://${this.host}:${this.port}`
    }
}

module.exports = globalConfig