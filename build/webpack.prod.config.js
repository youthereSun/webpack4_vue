const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//css提取
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');//css压缩器


let rootPath = path.resolve(__dirname, '../');
let distPath = path.resolve(rootPath, 'prod');
let srcPath = path.resolve(rootPath, 'src');

module.exports = {
    mode: "production",
    entry: path.join(srcPath,'index.js'),
    devtool:false,
    output: {
        path: distPath,
        filename: 'static/js/build.[hash:10].js',
    },
    resolve: {
        extensions: ['.js','.vue','.jsx'], // 解析扩展。（当我们通过路导入文件，找不到改文件时，会尝试加入这些后缀继续寻找文件）
        alias: {
            '@': srcPath // 在项目中使用@符号代替src路径，导入文件路径更方便
        }
    },

    module: {
        rules:  [
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
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                ],
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [{
                    loader: 'url-loader',
                    // loader: 'file-loader',
                    options: {
                        esModule: false, // 这里设置为false
                        name: 'static/img/[name].[ext]',//将图片打包到images目录，{ test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=43959&name=images/img-[hash:7].[ext]' }
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
                        name: 'static/fonts/[name].[ext]',//将字体打包到fonts目录
                    }
                }]}//字体解析器

        ]
    },

    plugins:[
         new MiniCssExtractPlugin({   //生产环境提取css
           filename: 'static/css/[name].css',
           chunkFilename: '[id].css',
         }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template:path.join(rootPath,'public/index.html')
        }),
        new CleanWebpackPlugin()
    ],
    /*合并css*/
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
        minimizer: [
            /*      new UglifyJsPlugin({
                      cache: true,
                      parallel: true,
                      sourcMap: true
                  }),*/
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
};
