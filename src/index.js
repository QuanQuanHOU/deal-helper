import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// 使用 ReactDOM.createRoot 创建根
const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);

// 使用 root.render 来渲染 React 组件
root.render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>
);