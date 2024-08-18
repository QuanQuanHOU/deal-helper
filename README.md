# 项目结构
```
project-name/
│
├── node_modules/       # 存放项目依赖的模块
│
├── .env               # 环境变量配置文件
│
├── package.json        # 项目配置和依赖信息
│
├── server.js           # Express 服务器的主入口文件
│
├── app.js              # 可选，用于分离 Express 应用设置和路由
│
├── config/             # 存放配置文件，如数据库配置
│   ├── database.js
│   └── ...
│
├── models/             # Mongoose 模型定义
│   ├── user.js
│   └── ...
│
├── routes/             # Express 路由定义
│   ├── users.js
│   └── ...
│
├── controllers/        # 控制器，处理业务逻辑
│   ├── userController.js
│   └── ...
│
├── middleware/         # 中间件
│   ├── auth.js
│   └── ...
│
├── tests/              # 测试文件
│   ├── user.test.js
│   └── ...
│
└── utils/              # 工具和辅助函数
    ├── errorHandler.js
    └── ...
```

# 前段结构
```
src/
│
├── App.js                # 主组件
├── Calculator.js         # 定价计算器组件
├── ExchangeRateService.js # 汇率服务（使用 Axios）
│
└── index.js              # 入口文件
```
