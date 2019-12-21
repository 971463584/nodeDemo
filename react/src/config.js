export default {
    host: '127.0.0.1', //域名
    port: 3000, //端口
    setApiUrl: function (urls) {
        if (process.env.NODE_ENV === 'development') {
            return 'http://' + this.host + ':' + this.port + urls;
        } else {
            return urls;
        }
    }
}

// export default {
//     host: 'test.panda.tv', //域名
//     setApiUrl: function (urls) {
//         if (process.env.NODE_ENV === 'development') {
//             return 'http://' + this.host + urls;
//         } else {
//             return urls;
//         }
//     }
// }
