// server.js

const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database'); // 引入数据库配置模块
const logisticsRoute = require('./routes/logistics'); // 引入路由

const app = express();

// 配置中间件
app.use(bodyParser.json());

// 连接数据库
dbConfig(); // 调用数据库配置模块中的连接函数

// 设置CORS响应头
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有域名访问
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // 拦截OPTIONS请求
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 使用路由
app.use('/api', logisticsRoute); // 为用户路由设置前缀 



// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));