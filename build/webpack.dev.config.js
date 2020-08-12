const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

let rootPath = path.resolve(__dirname, '../');
let srcPath = path.resolve(rootPath, 'src');

module.exports = {
    mode: "development",
    entry: path.join(srcPath,'index.js'),
    output: {
        publicPath: "/",
        filename: 'bundle.js'
    },
    devtool:'eval-source-map',
    resolve: {
        extensions: ['.js','.vue','.jsx'], // 解析扩展。（当我们通过路导入文件，找不到改文件时，会尝试加入这些后缀继续寻找文件）
        alias: {
            '@': srcPath // 在项目中使用@符号代替src路径，导入文件路径更方便
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',

            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [{
                    loader: 'url-loader',
                    // loader: 'file-loader',
                    options: {
                        esModule: false, // 这里设置为false
                        name: 'static/images/[name].[ext]',//将图片打包到images目录，{ test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=43959&name=images/img-[hash:7].[ext]' }
                        limit: 10240
                    }
                }]
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            },
            {test:/\.(ttf|eot|svg|woff|woff2|otf)$/,
                use:[{
                    loader: 'url-loader',
                    // loader: 'file-loader',
                    options: {
                        esModule: false, // 这里设置为false
                        name: 'fonts/[name].[ext]',//将字体打包到fonts目录
                    }
                }]}//字体解析器

        ]
    },
    plugins:[

        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template:path.join(rootPath,'public/index.html'),
            inject: true
        })
    ],
    devServer: {

        publicPath: '/',//开发环境资源存放位置
        compress: true,
        proxy: {
            '/api': {
                target: 'http://192.168.0.227:8030',  //本地测试接口域名
                changeOrigin: true,  //是否跨域
                pathRewrite: {
                    '^/api': ''   //重写接口
                },

            }
        },
        host: 'localhost',
        port: 8090, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        open:true
    }
};
