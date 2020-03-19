### 推荐安装yarn
1. 确保 node 版本是 8.10 或以上
2. npm i yarn -g

### 快速开始

进入目录安装依赖:

```bash
yarn install
```

启动服务.

```bash
$ yarn start
```

编译.

```bash
$ umi build
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

