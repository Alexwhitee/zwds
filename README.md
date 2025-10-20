

# ✨ 手机端紫微斗数：揭示宇宙奥秘（AI加持版） ✨

本项目是一个基于 React 的应用，用于可视化和交互式地展示占星图，特别是专注于 Izpalace（紫微斗数）系统。

**本项目现已接入最先进的AI大模型，为您提供完全免费的命理AI解读服务。** 同时，应用界面**完美适配手机端屏幕**，并**提供了可在 Release 处下载的安卓 (Android) APK 手机版**，让您随时随地探索宇宙奥秘。

它利用 `iztro` 库进行占星计算和数据处理，并使用 React 来构建动态用户界面。

## 🚀 核心功能

* **✨ 免费AI解读：** 接入最先进的AI大模型，提供智能化的命理分析和免费解读服务。
* **📱 移动端优先与APK下载：** 采用响应式设计，完美适配手机端屏幕。用户可直接在 "Release" 页面下载安卓 (Android) 手机版 APK。
* **交互式排盘展示：** 显示带有交互元素的详细紫微盘。
* **动态数据可视化：** 可视化命理数据，包括宫位、星曜和四化星。
* **时间范围探索：** 允许用户探索不同时间范围（大限、流年、流月、流日、流时）的命理数据。
* **中心信息枢纽：** `IzpalaceCenter` 组件以清晰有序的方式显示关键占星信息。

## 🛠️ 技术栈

* **前端：**
    * React
    * TypeScript
    * CSS
* **构建工具：**
    * Vite
* **库：**
    * `classnames`
    * `iztro`
    * `iztro-hook`
    * `react-dom`
    * `lunar-lite`
* **其他：**
    * `@vitejs/plugin-react`
    * `@types/react`
    * `@types/react-dom`

## 📦 入门指南（开发者）

请按照以下步骤在您的本地机器上启动并运行本项目（**注意：普通用户请直接前往 Release 页面下载 APK**）。

### 先决条件

* Node.js (版本 \>= 16)
* npm 或 yarn 或 pnpm

### 安装

1.  克隆仓库：

    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2.  安装依赖项：

    ```bash
    npm install # or yarn install or pnpm install
    ```

### 本地运行

1.  启动开发服务器：

    ```bash
    npm run dev # or yarn dev or pnpm dev
    ```

2.  打开您的浏览器并导航至 Vite 提供的地址（通常是 `http://localhost:5173/`）。

## 📂 项目结构

```
├── .gitignore
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.js
├── index.html
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── Iztrolabe.tsx
│   ├── Izpalace
│   │   ├── Izpalace.css
│   │   ├── Izpalace.tsx
│   │   ├── Izpalace.type.ts
│   │   └── index.ts
│   ├── IzpalaceCenter
│   │   ├── Item.tsx
│   │   ├── IzpalaceCenter.css
│   │   ├── IzpalaceCenter.tsx
│   │   ├── Line.tsx
│   │   └── index.ts
│   ├── Izstar
│   │   ├── Izstar.tsx
│   │   ├── Izstar.type.ts
│   │   └── index.ts
│   ├── assets
│   │   └── react.svg
│   ├── config
│   │   └── types.ts
│   ├── index.css
│   ├── index.ts
│   ├── main.tsx
│   └── vite-env.d.ts
```

## 📸 屏幕截图

（应用程式的屏幕截图将放置在此处）

## 🤝 贡献

欢迎贡献！请遵循以下步骤：

1.  Fork 仓库。
2.  为您的新功能或错误修复创建一个新分支。
3.  进行您的更改，并以清晰、简洁的消息提交它们。
4.  提交拉取请求（Pull Request）。


## 📬 联系方式

如果您有任何问题或建议，请随时联系：

* [robert213@foxmail.com]
* [vx:mingli359278]

## 💖 鸣谢

感谢您使用项目！希望您觉得它有用且有趣。您的反馈和贡献将不胜感激。

