const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');


let rootPath = path.resolve(__dirname, '../');
let distPath = path.resolve(rootPath, 'com');
let srcPath = path.resolve(rootPath, 'src');

module.exports = {
    mode: "production",
    entry: path.join(srcPath,'main.js'),
    devtool:false,
    output: {
        path: distPath,
        filename: 'component.[hash:10].js',
    },
    resolve: {
        extensions: ['.js','.vue','.jsx'], // 解析扩展。（当我们通过路导入文件，找不到改文件时，会尝试加入这些后缀继续寻找文件）
        alias: {
            '@': srcPath // 在项目中使用@符号代替src路径，导入文件路径更方便
        }
    },

    module: {
        rules: [
            {
                // 符合以 .js 或者 .jsx 结尾的文件, 使用 babel-loader
                test: /\.(js|jsx)$/,
                // 打包时, 不去node_modules 目录下找
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [{
                    loader: 'url-loader',
                    // loader: 'file-loader',
                    options: {
                        esModule: false, // 这里设置为false
                        name: '[name].[ext]',//将图片打包到images目录，{ test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=43959&name=images/img-[hash:7].[ext]' }
                        limit: 10240
                    }
                }]
            },
            {
                test: /\.vue$/,
                use:{
                    loader: 'vue-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    // isProd?{
                    //   loader: MiniCssExtractPlugin.loader,   //生产环境启用css提取
                    //   options: {
                    //     publicPath: './',
                    //     hmr: !isProd,   //启用热更新
                    //   },
                    // }:
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins:[
        // new CleanWebpackPlugin(),    //编译前清除文件，防止文件冗余
        // new MiniCssExtractPlugin({   //生产环境提取css
        //   filename: 'css/[name].css',
        //   chunkFilename: '[id].css',
        // }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template:path.join(rootPath,'prod.html')
        }),
        new CleanWebpackPlugin()
    ]
};
