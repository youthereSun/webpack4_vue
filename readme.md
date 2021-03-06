# 前端修仙路-webpack教程(v4.x)
> 本质上，webpack 是一个现代 JavaScript 应用程序的`静态模块打包器`(module bundler)。

当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个代码块（bundle），`webpack默认只具备打包js的能力`。

---
## 名词解释
1. `bundle`:  一个或多个编译后的代码块
2. `entry`:   入口，webpack编译的入口
3. `output`   出口，webpack编译的出口
4. `loader`   加载器，webpack默认只支持js的打包，如果需要处理其他类型文件，则需要引入相应的loader。
5. `plugins` 插件，可以看做是webpack能力的扩充，用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。
6. `mode`   模式，指定开发环境的模式，可以对特定环境的编译进行优化。
7. `HMR` 模块热替换(hot module replacement),无需浏览器刷新，即可局部更新代码以及样式。

## 安装
```bash
> npm init -y
> npm install webpack webpack-cli
```
1. `npm init -y` npm初始化一个项目，创建package.json
2. `npm install -D webpack webpack-cli` 安装webpack开发依赖。


## 使用
初始项目结构如下：
* build
    * webpack.config.js
* src
    * module
        * a.js
    * index.js
* package.json

1. 创建webpack的配置文件
```javascript
// build/webpack.config.js
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: '../src/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```
1. `mode` 配置打包环境，取值<development | production | none>
2. `entry` 打包的入口js文件，可以是多个，多个就填数组。
3. `output` 打包编译后出口
    * `path` 编译出口目录
    * `filename` 编译后js文件名
4. `process.env.NODE_ENV` 这个是node的环境变量，由运行的时候决定。

下面瞎写一个入口文件:
```javascript
// src/index.js
import say from './module/a'    //随便引入个模块
say.sayName();

// src/module/a.js
export default {
    name:'hzz',
    sayName(){
        console.log(this.sayName);
    }
}
```

然后再在package.json添加编译命令:
```json
{
  "name": "webpack-tutorial",
  "version": "1.0.0",
  "description": "webpack tutorial",
  "main": "index.js",
  "author": "terryvvan",
  "license": "MIT",
  "private": false,
  //重点
  "scripts": {
    "start": "npm run dev",
    "dev": "set NODE_ENV=development&&webpack --config ./build/webpack.config.js",
    "build": "set NODE_ENV=production&&webpack --config ./build/webpack.config.js"
  },
  "devDependencies": {
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.11"
  }
}
```
1. `set NODE_ENV=development` 这句命令是windows环境下设置环境变量（如果需要跨平台的设置，请使用cross-env），目的是为了决定webpack的mode环境，以便其进行特定优化编译。
2. `webpack --config <path>` 执行配置文件交给webpack编译。 

最后执行命令:
```bash
> npm start
webpack-tutorial@1.0.0 start C:\Users\24244\Desktop\study\webpack-tutorial
npm run dev


webpack-tutorial@1.0.0 dev C:\Users\24244\Desktop\study\webpack-tutorial
set NODE_ENV=development&&webpack --config ./build/webpack.config.js

Hash: 8e8662107e05e5c7ab43
Version: webpack 4.43.0
Time: 243ms
Built at: 2020-05-24 18:46:26
  Asset      Size  Chunks             Chunk Names
main.js  19.5 KiB    main  [emitted]  main
Entrypoint main = main.js
[./build/webpack.config.js] 277 bytes {main} [built]
    + 2 hidden modules
```

至此完成最小化打包，我们继续完善这个例子，目前只能打包js，web环境离不开html和css，接下来加入html和css。

## css及html支持
```html
<!-- public/index.html -->
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="shortcut icon" type="images/x-icon" href="./favicon.ico">
    <title>webpack App</title>
  </head>
  <body>
      <div id="app">
        <p>hello world</p>
      </div>
  </body>
</html>
```
新建public目录，存放html文件以及一些公共资源，这常在`vue-cli`和`create-react-app`的目录结构中看到，该目录下的文件不参与编译，仅仅只是拷贝到输出（output>path）目录。

然后在新增assets目录，存放css或图片等静态资源文件，该目录下的文件会参与编译。
```css
<!-- src/assets/app.css -->
#app{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
p{
    color:blue;
}
```
目前已建立的目录结构如下：
* build
    * webpack.config.js
* public
    * favicon.ico
    * index.html
* src
    * assets
        * app.css
    * module
        * a.js
    * index.js
* package.json

为了解析html和css，修改配置文件如下：
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin'); //html生成
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin'); //复制文件目录

let env = process.env.NODE_ENV;        //当前环境
let isProd = env=='production';
let rootPath = path.resolve(__dirname, '../');  //项目根路径
let distPath = path.resolve(rootPath, 'dist');  //项目编译输出路径
let srcPath = path.resolve(rootPath, 'src');    //源码路径

module.exports = {
  mode: env,
  entry: path.join(srcPath,'index.js'),
  output: {
    path: distPath,
    filename: 'js/[name].js',
    // publicPath: './'
  },
  resolve: {
    extensions: ['.js'], // 自动解析扩展。（import导入文件时可省略此处定义的扩展）
    alias: {
        '@': srcPath // 在项目中使用@符号代替src路径，导入文件路径更方便
    }
  },
  module: {
    rules: [                    //配置loader处理相应文件
      {
        test: /\.css$/,        //正则匹配导入的css文件
        use: [
          'style-loader',      //将处理好css文件通过内联方式导入html
          'css-loader'         //处理css文件
        ]
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({        //生成html
      minify:isProd,    //是否压缩
      hash:isProd,      //是否为资源生成hash值，避免缓存
      template:path.join(rootPath,'public/index.html') //模板路径，可以是ejs文件
    }),
    new CopyWebpackPlugin({ //复制public目录的所有文件到dist目录
      patterns:[
        {from:path.resolve(rootPath,'public'),to:distPath}
      ],
      options:{}
    }),
  ]
};
```

安装解析html和css所需依赖,并执行构建：
```javascript
> npm install -D html-webpack-plugin css-loader copy-webpack-plugin
> npm run start
```

此时，我们的项目已经可以编译html+css+js三大件了，但有一个缺陷，我们现在的项目每次修改只能手动进行编译。我们在使用vue或者react脚手架时，都会自动启用一个开发环境的服务器，便于预览，甚至可以在修改文件时，自动执行编译。

接下来我们加入webpack-dev-server服务：
```javascript
> npm install -D webpack-dev-server
```

修改package.json的dev命令,改由webpack的开发服务器启动：
```json
"scripts": {
    "start": "npm run dev",
    "dev": "set NODE_ENV=development&&webpack-dev-server --config ./build/webpack.config.js"
  },
```

修改webpack的配置文件，以支持启动：
```javascript
//略...
module.exports = {
    //略...
    devServer: {
        historyApiFallback: true,   //找不到地址回滚到index.html
        contentBase: './dist',  //默认是项目根目录，服务器开启目录即index.html所在目录
        // publicPath:'./dist',
        progress:true,      //开启进度
        compress: isProd,   //开启gzip压缩
        host:'localhost',   //主机地址，填局域ip或者0.0.0.0可局域网内访问
        hot:true,           //开启热更新，即无需刷新即可更新改动
        hotOnly:true,       //只启动热更新，将不会自动刷新页面
        port: 9000,         //端口
        open: !isProd,      //是否自动打开浏览器
        // https: true,     //启用https服务器
        overlay: true,      //错误是否显示在页面上
        stats:{             //一些状态的提示信息
            warnings: true,
            errors: true,
            errorDetails: true,
            colors: true,
            performance: true,  //当文件大小超过 `performance.maxAssetSize` 时显示性能提示
        },
        proxy: {        //开启代理，不需要可以不配置
            "/api": {  // /api下请求将被代理
                target: "http://localhost:3000", //要代理的域名
                pathRewrite: {"^/api" : ""},
                // secure: false //关闭安全验证，这样可以使用代理服务器不安全的https证书
            }
        }
    },
}
```
入口文件首行新增：
```javascript
// src/index.js
if (module.hot) {        //接受热更新，如果是vue单页环境不需要这个也可以
    module.hot.accept();
}
//...省略无关代码
```
接下来启动项目：
```bash
>npm start

> webpack-tutorial@1.0.0 start C:\Users\Administrator\Desktop\temp\webpack-tutorial
> npm run dev


> webpack-tutorial@1.0.0 dev C:\Users\Administrator\Desktop\temp\webpack-tutorial
> set NODE_ENV=development&&webpack-dev-server --config ./build/webpack.config.js

10% building 1/1 modules 0 activei ｢wds｣: Project is running at http://localhost:9000/
i ｢wds｣: webpack output is served from /
i ｢wds｣: Content not from webpack is served from ./dist
11% building 13/14 modules 1 active C:\Users\Administrator\Desktop\temp\webpack-tutorial\node_modules\babel-loader\lib\index.js!C:\Users\Administrator\Desktop\temp\webpack-tutorial\src\index.jsi ｢wdm｣: wait until bundle finished: /
i ｢wdm｣: Hash: 6c51adf39d371da68654
Version: webpack 4.43.0
Time: 3867ms
Built at: 2020-05-27 15:19:42
         Asset       Size  Chunks                   Chunk Names
   favicon.ico   3.08 KiB          [emitted]
    index.html  361 bytes          [emitted]
    js/main.js   1.57 MiB    main  [emitted]        main
js/main.js.map   1.81 MiB    main  [emitted] [dev]  main
Entrypoint main = js/main.js js/main.js.map
[0] multi (webpack)-dev-server/client?http://localhost:9000 (webpack)/hot/only-dev-server.js ./src/index.js 52 bytes {main} [built]
[./node_modules/react-dom/index.js] 1.33 KiB {main} [built]
[./node_modules/react/index.js] 190 bytes {main} [built]
[./node_modules/vue/dist/vue.runtime.esm.js] 222 KiB {main} [built]
[./node_modules/webpack-dev-server/client/index.js?http://localhost:9000] (webpack)-dev-server/client?http://localhost:9000 4.29 KiB {main} [built]
[./node_modules/webpack-dev-server/client/overlay.js] (webpack)-dev-server/client/overlay.js 3.51 KiB {main} [built]
[./node_modules/webpack-dev-server/client/socket.js] (webpack)-dev-server/client/socket.js 1.53 KiB {main} [built]
[./node_modules/webpack-dev-server/client/utils/createSocketUrl.js] (webpack)-dev-server/client/utils/createSocketUrl.js 2.91 KiB {main} [built]
[./node_modules/webpack-dev-server/client/utils/log.js] (webpack)-dev-server/client/utils/log.js 964 bytes {main} [built]
[./node_modules/webpack-dev-server/client/utils/reloadApp.js] (webpack)-dev-server/client/utils/reloadApp.js 1.59 KiB {main} [built]
[./node_modules/webpack-dev-server/client/utils/sendMessage.js] (webpack)-dev-server/client/utils/sendMessage.js 402 bytes {main} [built]
[./node_modules/webpack-dev-server/node_modules/strip-ansi/index.js] (webpack)-dev-server/node_modules/strip-ansi/index.js 161 bytes {main} [built]
[./node_modules/webpack/hot sync ^\.\/log$] (webpack)/hot sync nonrecursive ^\.\/log$ 170 bytes {main} [built]
[./node_modules/webpack/hot/only-dev-server.js] (webpack)/hot/only-dev-server.js 2.52 KiB {main} [built]
[./src/index.js] 662 bytes {main} [built]
    + 53 hidden modules
Child HtmlWebpackCompiler:
                          Asset       Size               Chunks             Chunk Names
    __child-HtmlWebpackPlugin_0    4.6 KiB  HtmlWebpackPlugin_0             HtmlWebpackPlugin_0
                    favicon.ico   3.08 KiB                       [emitted]
                     index.html  327 bytes
    Entrypoint HtmlWebpackPlugin_0 = __child-HtmlWebpackPlugin_0
    [./node_modules/html-webpack-plugin/lib/loader.js!./public/index.html] 619 bytes {HtmlWebpackPlugin_0} [built]
i ｢wdm｣: Compiled successfully.
```
然后webpack会自动打开浏览器，浏览器的控制台会显示下面这句话：
```bash
[HMR] Waiting for update signal from WDS...
```
这个表示webpack-dev-server的热更新已开启，从此改动js，css就不需要重新编译，也不需要刷新浏览器，它会帮你在改动的时候自动更新。

## vue支持
这样就够了嘛？不够，来加入vue，安装vue三大件依赖：
```bash
> npm install -D vue-style-loader vue-loader vue-template-compiler
> npm install vue
```
1. `vue-style-loader` 处理vue组件的style标签
2. `vue-loader` 点击右侧传送门，即可前往文档=>[传送门](https://vue-loader.vuejs.org/zh/)
3. `vue-template-compiler` 处理vue组件template标签

修改webpack配置以支持vue：
```javascript
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin');
//...省略无关代码
module.exports = {
  //...省略无关代码
  resolve: {
    extensions: ['.js','.vue'], // 解析扩展。
    alias: {
        '@': srcPath // 在项目中使用@符号代替src路径，导入文件路径更方便
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use:{
            loader: 'vue-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader', //style-loader替换成vue的
          'css-loader' 
        ]
      }
    ]
  },
  plugins:[
    //...省略无关代码
    new VueLoaderPlugin(),
  ]
}
```
现在增加一个vue的测试组件：
```javascript
// src/components/HelloWorld.vue
<template>
  <div class="root">
      hello {{this.name}}
  </div>
</template>

<script>
  export default {
      name:'HelloWorld',
      data(){
          return {
              name:'vue'
          }
      }
  }
</script>

<style>
  .root{
      color: aquamarine;
  }
</style>
```
入口文件引入vue组件：
```javascript
// src/components/HelloWorld.vue
import say from '@/module/a'
import '@/assets/app.css'
import Vue from 'vue'
import HelloVue from '@/components/helloWorld'

say.sayName();
console.log(1334);

new Vue({
    el: '#helloVue',
    render: h => h(HelloVue)
})
```
至此vue系列加入完毕，运行即可看到效果：
```bash
> npm start
```

## react支持
这就够了嘛，不！既然vue加了，作为国内同样流行的react理应也加入进来，我们先来安装依赖：
```bash
npm install -D babel-loader @babel/preset-env @babel/preset-react @babel/core @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators
npm install react react-dom
```
1. `babel-loader` 用来处理js
2. `@babel/preset-env` 用于支持es6的语法
3. `@babel/preset-react` 支持react，不用说
4. `@babel/core` 提供给其他插件转码使用
5. `@babel/plugin-proposal-class-properties` class支持
6. `@babel/plugin-proposal-decorators`  装饰器支持

还有一些其他的babel插件支持就不说了，给个=>[传送门](https://www.babeljs.cn/docs/)

接下来我们修改webpack的配置文件以支持react：
```javascript
// webpack.config.js
// ...省略无关代码
module.exports = {
  resolve: {
    extensions: ['.js','.vue','.jsx'], // 解析扩展。
    alias: {
        '@': srcPath // 在项目中使用@符号代替src路径，导入文件路径更方便
    }
  },
  module: {
    rules: [
      {
        // 以 .js 或者 .jsx 结尾的文件, 使用 babel-loader
        test: /\.(js|jsx)$/,
        // 编译时, 不去node_modules 目录下找
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      }
      // ...省略无关代码
    ]
  }
  // ...省略无关代码
}
```
项目根目录创建babel的配置文件：
```javascript
// babel.config.js
module.exports = {
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: [
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }]
      ]
};
```
我们来随便写个react组件：
```javascript
// src/components/HelloReact.jsx
import React from 'react'
export default class HelloReact extends React.Component {
    render() {
      return (
        <div>
          Hello {this.props.name}
        </div>
      );
    }
  }
```
入口文件引入react：
```javascript
// src/index.js
if (module.hot) {
    module.hot.accept();     //接受热更新
}
import say from '@/module/a'
import '@/assets/app.css'
import Vue from 'vue'
import React from 'react'
import ReactDOM from 'react-dom'
import HelloVue from '@/components/helloWorld'
import HelloReact from '@/components/HelloReact'

say.sayName();
console.log(1334);
  
ReactDOM.render(
    <HelloReact name="Taylor" />,
    document.getElementById('helloReact')
);

new Vue({
    el: '#helloVue',
    render: h => h(HelloVue)
})
```

修改index.html:
```html
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="shortcut icon" type="images/x-icon" href="./favicon.ico">
    <title>webpack App</title>
  </head>
  <body>
      <div id="app">
        <p>hello world</p>
        <div id="helloReact"></div>
        <div id="helloVue"></div>
      </div>
  </body>
</html>
```
现在我们可以运行了：
```bash
npm start
```
大功告成!
![运行效果图示](src/assets/images/6.jpg "运行效果图")

以上示例代码地址：[https://github.com/terryvince/webpack-tutorial.git](https://github.com/terryvince/webpack-tutorial.git)，如果对你有帮助记得点个star。

## 尾声
当然在实际工作中，还需添加wepack更多的loader以及plugin的支持才能满足需要，还有webpack的配置文件需要分开，抽离开发环境（webpack.dev.config.js），抽离生产环境（webpack.prod.config.js），抽离基础配置（webpack.base.config.js）。

比如sass支持，需要引入sass-loader，图片处理，需要引入file-loader等等，这些就留给大家去探索。如果实在有兴趣的可以安装笔者写的cli工具，来拉取webpack模板研究，这个webpack模板乃笔者在生产环境中得到检验，目前支持vue以及ts或者多页开发环境。下面给出获取方法：

### 方法一
通过cli拉取
```bash
npm install vvan-cli -g
vvan init
```
* `vvan-cli` 是笔者发布在npm的包，方便平时下载使用。
* `vvan init <projectName>` 如果不写名字，会通过问询让你确定项目的名字以及其他配置

项目生成好后，你可以在项目根目录的build目录找到所有的配置信息。

### 方法二
从github地址拉取：
```bash
git clone https://github.com/terryvince/webpack-build-template.git
```

更多高级教程请移步[webpack中文网](https://www.webpackjs.com/)，有能力的可以去读英文官网 :)
