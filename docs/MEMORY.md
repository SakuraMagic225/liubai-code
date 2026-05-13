# 长期记忆

## 项目：留白code 个人博客

### 基本信息
- **项目名**：留白code
- **副标题**：用代码留白，为思考赋能
- **风格**：极简、浅绿色主色调、大量留白、舒适阅读
- **架构**：前后端分离

### 技术选型
- **前端**：React 18 + TypeScript + Vite + Tailwind CSS
- **后端**：Spring Boot 3.x + MyBatis-Plus + MySQL 8.0 + Redis
- **认证**：JWT + Spring Security
- **部署**：云服务器（前后端同机，Nginx 反向代理）
- **注释**：Maven 多模块

### 设计定稿
- **配色**：浅绿（#EAF3DE ~ #27500A）为底色 + 暖珊瑚（#D85A30 ~ #F5C4B3）为点缀色
- **风格**：极简 + 玻璃质感（backdrop-filter blur）+ 悬浮交互
- **布局**：顶部导航 + Hero区（精选文章）+ 左文章列表/右侧边栏 + 页脚
- **交互**：卡片悬浮上移变珊瑚边框、导航/标签悬浮变色、按钮悬停缩放

### 需求概要
- **Phase 1 (MVP)**：首页、文章列表、文章详情（含 Markdown 渲染）、文章 CRUD
- **Phase 2**：标签筛选、搜索、归档、评论区(Giscus)、响应式
- **Phase 3**：统计、RSS、SEO、访问统计

### 文档位置
- 需求文档：`requirements.md`
- 开发规范：`standards.md`
