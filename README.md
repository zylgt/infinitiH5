### 推荐安装yarn
1. 确保 node 版本是10.13 或以上
2. npm i yarn -g

### 安装依赖

进入目录安装依赖:

```bash
yarn install
```

### 启动服务.

开始-测试环境

```bash
$ yarn start
```
开始-生产环境

```bash
$ yarn start:prod 
```


### 编译.

编译-测试环境

```bash
$ yarn build
```

编译-生产环境

```bash
$ yarn build:prod
```

### 目录结构
```bash
|-- mock                                  # 本地模拟数据
|-- public                                # 静态资源
|-- src                                   # 
|   |-- assets                            # 本地静态资源
|   |-- components                        # 业务通用组件
|   |-- container                         # 业务逻辑层
|   |-- layout                            # 通用布局
|   |-- models                            # 全局 dva model
|   |-- services                          # 后台接口服务
|   |-- pages                             # 业务页面入口和常用模板
|   |-- utils                             # 存放公共文件
|   |-- global.css                        # 全局样式
|   |-- dva.js                          
|-- .gitignore                            # git忽略文件
|-- .editorconfig                         # 编辑器代码风格配置
|-- .eslintrc                             # eslint规则
|-- .env                                  # 环境变量
|-- .prettierignore                       # 代码风格配置忽略文件
|-- .prettierrc                           # 代码风格配置文件
|-- package.json                          # 配置
|-- README.md 

```   

