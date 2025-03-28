# 笙酒防伪标识项目

## 项目概述
本项目构建了一个基于WebGL的可视化系统，借助Three.js库来创建3D场景。其核心功能在于依据窗口的位置和鼠标的移动，动态地更新球体的位置与数量。项目通过WebSocket实现了消息的广播，还利用`localStorage`存储窗口和鼠标的相关数据。

## 功能特性
1. **窗口管理**：对多个窗口的信息进行追踪，包含窗口的位置、大小和唯一ID。
2. **3D场景渲染**：运用Three.js库渲染3D场景，场景中存在多个彩色的球体。
3. **鼠标交互**：鼠标移动时，球体会朝着鼠标的位置移动。
4. **实时更新**：窗口信息或者鼠标位置发生变化时，场景会实时更新。
5. **WebSocket通信**：服务器端能够将消息广播给所有连接的客户端。

## 项目结构
```
ljhboollink/
├── index.html          # 项目的HTML文件
├── main.js             # 主JavaScript文件，负责场景设置、渲染和交互逻辑
├── server.js           # WebSocket服务器端代码
├── WindowManager.js    # 窗口管理类，用于处理窗口信息的存储和更新
└── three.r124.min.js   # Three.js库文件
```

## 安装与运行

### 前端部分
1. 把项目克隆到本地：
```bash
git clone https://github.com/yourusername/ljhboollink.git
cd ljhboollink
```
2. 开启一个本地服务器。例如，使用Python的`http.server`模块：
```bash
python -m http.server
```
3. 在浏览器里打开`http://localhost:8000`。

### 服务器端部分
1. 确保你已经安装了Node.js。
2. 运行服务器：
```bash
node server.js
```
服务器会在端口8080上启动。

## 代码说明

### `index.html`
此文件为项目的入口，引入了Three.js库和主JavaScript文件。

### `main.js`
- **场景设置**：借助`setupScene`函数设置3D场景和相机。
- **窗口管理**：利用`WindowManager`类管理窗口信息。
- **鼠标交互**：通过`onMouseMove`函数监听鼠标移动事件，更新鼠标的全局位置。
- **渲染循环**：使用`render`函数持续渲染场景。

### `server.js`
这是一个WebSocket服务器，用于将消息广播给所有连接的客户端。

### `WindowManager.js`
- **窗口信息存储**：运用`localStorage`存储窗口信息。
- **事件监听**：监听窗口的关闭事件和`localStorage`的变化。
- **回调函数**：设置窗口形状变化和窗口数量变化的回调函数。

## 配置参数
- **管理端模式**：在URL后面添加`?admin=true`可开启管理端模式。
- **清除本地存储**：在URL后面添加`?clear`可清除`localStorage`中的数据。

## 贡献指南
1. 把项目fork到自己的仓库。
2. 创建一个新的分支：`git checkout -b feature/your-feature-name`。
3. 提交你的更改：`git commit -m "Add some feature"`。
4. 推送至分支：`git push origin feature/your-feature-name`。
5. 发起一个Pull Request。

## 许可证
本项目采用[MIT许可证](LICENSE)。
