const path = require('path');

// ref: https://umijs.org/config/
export default {
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        ['umi-plugin-react', {
            antd: true,
            dva: true,
            dynamicImport: false,
            dll: true,
            routes: {
                exclude: [
                    /model\.(j|t)sx?$/,
                    /service\.(j|t)sx?$/,
                    /models\//,
                    /components\//,
                    /services\//,
                ]
            },
            hardSource: false,
        }],
    ],
    hash:true,
    alias:{
        components:path.resolve(__dirname,'src/components'),
        utils:path.resolve(__dirname,'src/utils'),
        services:path.resolve(__dirname,'src/services'),
        models:path.resolve(__dirname,'src/models'),
        // themes:path.resolve(__dirname,'src/themes'),
        images:path.resolve(__dirname,'src/assets')
    },
    chainWebpack(config, { webpack }) {
        config.output.filename(`[name].${Date.now()}.js`).end();
    },
    define: {
        'process.env.apiType' : 'dev'
    },
    base:'/q4/',
    outputPath: './dist/q4',
    publicPath: '/q4/',
    // proxy: {
    //   "/api": {
    //     "target": 'http://192.168.2.120:8081',
    //     "changeOrigin": true,
    //     "pathRewrite": { "^/api" : "/api" }
    //   }
    // }
}

