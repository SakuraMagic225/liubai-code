# 留白code · 开发规范

> 统一的规范让代码就像一篇好文章——清晰、干净、易读。

---

## 1. 技术栈规范

### 前端
| 类别 | 技术 | 版本约束 |
|------|------|---------|
| 框架 | React | ^18.x |
| 语言 | TypeScript | ^5.x |
| 构建工具 | Vite | ^5.x |
| 路由 | React Router | ^6.x |
| 服务端请求 | TanStack Query (React Query) | ^5.x |
| HTTP 客户端 | Axios | ^1.x |
| 样式 | Tailwind CSS | ^3.x |
| Markdown 渲染 | react-markdown + rehype-highlight | 最新 |
| 代码高亮 | highlight.js | 最新 |

### 后端
| 类别 | 技术 | 版本约束 |
|------|------|---------|
| 框架 | Spring Boot | 3.x |
| 语言 | Java | 17+ |
| ORM | MyBatis-Plus | 最新 |
| 数据库 | MySQL | 8.0 |
| 缓存 | Redis | 7.x |
| 认证 | Spring Security + JWT | 配合 Boot 版本 |
| API 文档 | SpringDoc OpenAPI | 2.x |
| 构建工具 | Maven | 3.9+ |
| 项目管理 | Maven | 多模块 |

---

## 2. 项目目录结构

### 2.1 整体结构

```
liubai-code/
├── frontend/              # 前端项目
│   ├── public/            # 静态资源
│   ├── src/
│   │   ├── api/           # API 接口定义
│   │   ├── components/    # 通用组件
│   │   ├── hooks/         # 自定义 Hooks
│   │   ├── layouts/       # 布局组件
│   │   ├── pages/         # 页面组件
│   │   │   ├── admin/     # 后台管理页面
│   │   │   ├── home/      # 首页
│   │   │   ├── article/   # 文章详情
│   │   │   ├── archive/   # 归档
│   │   │   └── about/     # 关于我
│   │   ├── router/        # 路由配置
│   │   ├── styles/        # 全局样式
│   │   ├── types/         # TypeScript 类型定义
│   │   └── utils/         # 工具函数
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/               # 后端项目（Maven 多模块）
│   ├── common/            # 公共模块：工具类、常量
│   ├── model/             # 数据模型模块：实体、DTO、VO
│   ├── repository/        # 数据访问模块：Mapper
│   ├── service/           # 业务逻辑模块：Service
│   ├── web/               # Web 层模块：Controller、拦截器、异常处理
│   │   └── src/main/java/
│   │       └── com/liubaicode/
│   │           ├── controller/
│   │           ├── config/
│   │           ├── interceptor/
│   │           ├── handler/
│   │           └── dto/
│   ├── admin/             # 后台管理模块
│   └── pom.xml            # 父 POM
│
├── docs/                  # 项目文档
│   ├── requirements.md    # 需求文档
│   ├── standards.md       # 开发规范
│   ├── api.md             # API 接口文档
│   └── deploy.md          # 部署文档
│
├── .gitignore
└── README.md
```

### 2.2 前端目录约定

```
src/
├── api/
│   ├── article.ts          # 文章相关 API
│   ├── tag.ts              # 标签相关 API
│   ├── auth.ts             # 认证相关 API
│   └── settings.ts         # 站点设置 API
├── components/
│   ├── common/             # 通用组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── TagBadge.tsx
│   │   └── Pagination.tsx
│   ├── article/            # 文章相关组件
│   │   ├── ArticleCard.tsx
│   │   └── ArticleList.tsx
│   └── admin/              # 后台组件
│       └── MarkdownEditor.tsx
├── hooks/
│   ├── useArticles.ts       # 文章数据 Hook
│   └── useAuth.ts           # 认证 Hook
├── pages/
│   ├── HomePage.tsx
│   ├── ArticleDetailPage.tsx
│   ├── ArchivePage.tsx
│   ├── AboutPage.tsx
│   └── admin/
│       ├── LoginPage.tsx
│       ├── ArticleManagePage.tsx
│       ├── ArticleEditPage.tsx
│       ├── TagManagePage.tsx
│       └── SettingsPage.tsx
├── types/
│   └── index.ts            # 全局类型定义
└── utils/
    ├── request.ts          # Axios 封装
    └── format.ts           # 日期格式化等
```

---

## 3. 命名规范

### 3.1 前端命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件名 | PascalCase | `ArticleCard.tsx` |
| 文件名（组件） | PascalCase | `ArticleList.tsx` |
| 文件名（非组件） | camelCase | `useArticles.ts`, `request.ts` |
| 变量/函数 | camelCase | `getArticleList()`, `articleCount` |
| 常量 | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| TypeScript 接口 | `I` 前缀 + PascalCase | `IArticle`, `IArticleQuery` |
| TypeScript 类型 | PascalCase | `ArticleStatus`, `PageResult<T>` |
| CSS 类名 | kebab-case | `article-card`, `tag-badge` |
| 路由路径 | kebab-case | `/article-list`, `/admin/article-new` |

### 3.2 后端命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 类名 | PascalCase | `ArticleController` |
| 方法名 | camelCase | `getArticleById()` |
| 变量 | camelCase | `articleService` |
| 常量 | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE` |
| 包名 | 全小写 | `com.liubaicode.service` |
| Controller 类 | `XxxController` | `ArticleController` |
| Service 接口 | `IXxxService` | `IArticleService` |
| Service 实现 | `XxxServiceImpl` | `ArticleServiceImpl` |
| Mapper 接口 | `XxxMapper` | `ArticleMapper` |
| Entity 类 | `Xxx` | `Article` |
| DTO | `XxxDto` / `XxxReq` / `XxxResp` | `ArticleCreateReq`, `ArticleListResp` |
| VO | `XxxVo` | `ArticleDetailVo` |

---

## 4. Git 提交规范

### 4.1 分支策略

```
main          # 生产分支（受保护，只能从 release 合并）
├── dev       # 开发分支（日常开发基础分支）
├── feat/xxx  # 功能分支（从 dev 切出，完成后合并回 dev）
├── fix/xxx   # 修复分支
└── release/xxx # 发布分支（从 dev 切出，合并到 main 并打 tag）
```

### 4.2 提交信息格式

```
<type>(<scope>): <subject>

<body>（可选）

<footer>（可选）
```

#### type 类型

| Type | 含义 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(article): add markdown editor` |
| `fix` | 修复 Bug | `fix(article): fix image upload 404` |
| `style` | 样式变动 | `style(home): adjust card spacing` |
| `refactor` | 重构 | `refactor(api): extract http client` |
| `docs` | 文档 | `docs: add api documentation` |
| `chore` | 构建/工具 | `chore: configure tailwind theme` |
| `perf` | 性能优化 | `perf(article): lazy load images` |
| `test` | 测试 | `test(service): add article service test` |

#### 示例

```
feat(article): add article list with pagination

- implement article list api with page query
- add ArticleCard component
- support tag filtering

Closes #12
```

---

## 5. API 设计规范

### 5.1 基础路径

```
# 前台接口（公开）
/api/v1/articles
/api/v1/tags
/api/v1/site-settings

# 后台接口（需认证）
/api/v1/admin/auth/login     # 登录接口，无需认证
/api/v1/admin/articles
/api/v1/admin/tags
/api/v1/admin/settings
```

### 5.2 通用规范

| 规则 | 说明 |
|------|------|
| 版本号 | URL 路径中带 v1、v2 |
| 请求方法 | GET（查）、POST（增）、PUT（改）、DELETE（删） |
| 请求体 | 统一使用 JSON |
| 响应格式 | 统一包装 `Result<T>` |
| 分页参数 | `page`（从 1 开始）、`pageSize`（默认 10） |
| 错误码 | 统一错误码 + 错误消息 |

### 5.3 统一响应结构

```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1712345678000
}
```

分页响应：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

### 5.4 核心接口列表

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/v1/articles` | 文章列表（分页 + 标签筛选 + 搜索） | 否 |
| GET | `/api/v1/articles/:id` | 文章详情 | 否 |
| GET | `/api/v1/tags` | 标签列表 | 否 |
| GET | `/api/v1/site-settings` | 站点设置（公开） | 否 |
| POST | `/api/v1/admin/auth/login` | 管理员登录 | 否 |
| POST | `/api/v1/admin/articles` | 创建文章 | 是 |
| PUT | `/api/v1/admin/articles/:id` | 更新文章 | 是 |
| DELETE | `/api/v1/admin/articles/:id` | 删除文章 | 是 |
| POST | `/api/v1/admin/tags` | 创建标签 | 是 |
| PUT | `/api/v1/admin/tags/:id` | 更新标签 | 是 |
| DELETE | `/api/v1/admin/tags/:id` | 删除标签 | 是 |
| GET | `/api/v1/admin/settings` | 获取站点设置 | 是 |
| PUT | `/api/v1/admin/settings` | 更新站点设置 | 是 |
| POST | `/api/v1/admin/upload/image` | 上传图片 | 是 |

---

## 6. 代码风格规范

### 6.1 前端

- **缩进**：2 空格
- **引号**：单引号
- **分号**：必须使用
- **尾逗号**：必须使用
- **行宽**：100 字符
- **组件风格**：函数式组件 + Hooks
- **Props 类型**：必须定义 TypeScript 类型

### 6.2 后端

- **缩进**：4 空格
- **遵循**：阿里巴巴 Java 开发手册
- **Lombok**：使用 `@Data`、`@Builder` 等减少样板代码
- **参数校验**：使用 `@Valid` + `jakarta.validation` 注解
- **异常处理**：全局 `@RestControllerAdvice` 统一处理
- **日志**：使用 SLF4J + Logback
- **分层职责**：
  - Controller：接收参数、校验、调用 Service、返回结果
  - Service：业务逻辑
  - Repository：数据访问，不包含业务逻辑

---

## 7. 数据库设计规范

### 7.1 通用规则

- **表名**：小写 + 下划线，如 `article_tag`
- **字段名**：小写 + 下划线，如 `created_at`
- **主键**：统一使用 `id BIGINT AUTO_INCREMENT`
- **时间字段**：`created_at`、`updated_at` 统一使用 `datetime`
- **逻辑删除**：使用 `is_deleted` 字段（`tinyint(1)`，0=未删，1=已删）
- **索引**：查询频繁的字段加索引，如 `article.status`、`article.created_at`
- **字符集**：`utf8mb4`（支持 emoji）
- **排序规则**：`utf8mb4_unicode_ci`
- 每张表必须有 `id`、`created_at`、`updated_at` 三个字段

### 7.2 表设计示例

```sql
CREATE TABLE article (
    id            BIGINT       AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(200) NOT NULL COMMENT '文章标题',
    summary       VARCHAR(500)          COMMENT '文章摘要',
    content_md    MEDIUMTEXT   NOT NULL COMMENT 'Markdown 原文',
    content_html  MEDIUMTEXT   NOT NULL COMMENT '渲染后的 HTML',
    cover_image   VARCHAR(500)          COMMENT '封面图 URL',
    status        TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '状态: 0=草稿, 1=已发布',
    view_count    INT          NOT NULL DEFAULT 0 COMMENT '阅读数',
    is_deleted    TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '逻辑删除',
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';
```

---

## 8. 开发流程

### 8.1 每日开发流程

```
1. git checkout dev && git pull
2. git checkout -b feat/xxx    # 新建功能分支
3. 编码 ...
4. git add . && git commit -m "feat(xxx): ..."
5. git push origin feat/xxx
6. 在 GitHub 上发起 Pull Request → dev
7. Review 后合并
```

### 8.2 本地开发

```
# 启动后端
cd backend
mvn clean install -DskipTests
mvn spring-boot:run

# 启动前端
cd frontend
pnpm install
pnpm dev

# 访问
前端: http://localhost:5173
后端: http://localhost:8080
API 文档: http://localhost:8080/swagger-ui.html
```

---

## 9. 浅绿色主题规范

### 9.1 颜色系统

```css
/* === 主色调 — 浅绿色系（底色） === */
--green-50:  #EAF3DE;   /* 极浅绿 — 卡片背景、标签底色 */
--green-100: #C0DD97;   /* 浅绿 — 边框、点缀 */
--green-200: #97C459;   /* 中浅绿 — 次要文字、装饰 */
--green-400: #639922;   /* 中绿 — 正文、标签文字 */
--green-600: #3B6D11;   /* 深绿 — 导航文字 */
--green-800: #27500A;   /* 墨绿 — 主标题、Logo */

/* === 点缀色 — 暖珊瑚（强调、交互） === */
--coral-50:  #FAECE7;   /* 极浅珊瑚 — 玻璃卡片底层 */
--coral-100: #F5C4B3;   /* 浅珊瑚 — 标签 Badge 底色、悬停边框 */
--coral-200: #F0997B;   /* 中浅珊瑚 — 按钮悬停 */
--coral-400: #D85A30;   /* 珊瑚 — 链接、按钮、强调文字 */
--coral-600: #993C1D;   /* 深珊瑚 — 按钮点击态 */
--coral-800: #712B13;   /* 暗珊瑚 — 极少数深色强调 */

/* === 背景色 === */
--bg-page:   #F7FBF2;   /* 页面背景 — 白中透绿 */
--bg-card:   #FFFFFF;   /* 卡片背景 */
--bg-glass:  rgba(255, 255, 255, 0.65);  /* 玻璃质感背景 */
```

### 9.2 交互效果规范

#### 悬浮（Hover）效果

所有可点击元素（链接、按钮、卡片、标签 Badge）必须有悬浮反馈。

| 元素 | 悬浮效果 | 过渡方式 |
|------|---------|---------|
| **文章卡片** | `transform: translateY(-2px)` + 边框变色 `#C0DD97` → `#D85A30` | `all 0.25s ease` |
| **导航链接** | 下划线从中间展开 + 颜色加深 `#3B6D11` → `#D85A30` | `color 0.2s ease` |
| **标签 Badge** | 背景色从绿色系过渡到珊瑚色系 | `background 0.2s ease` |
| **按钮** | 背景色加深 + `transform: scale(1.03)` | `all 0.2s ease` |
| **社交图标** | `opacity: 0.7` → `1` + 轻微上移 | `all 0.2s ease` |

> 统一过渡曲线使用 `cubic-bezier(0.4, 0, 0.2, 1)`，保持手感一致。

#### 点击（Active）效果

```css
/* 按钮点击 —— 略微缩小，模拟按压感 */
.button:active {
  transform: scale(0.97);
}

/* 卡片点击 */
.article-card:active {
  transform: translateY(-1px);
}
```

### 9.3 玻璃质感（Glassmorphism）规范

采用**克制**的玻璃质感 —— 不影响可读性，只增加层次感。

#### 应用场景

| 场景 | 样式 | 说明 |
|------|------|------|
| **页面顶部导航栏** | 毛玻璃（带透明感） | 滚动时半透明背景，不遮挡内容 |
| **Hero 区域背景** | 极浅绿色 + 半透明白色叠加层 | 柔和的分层感 |
| **侧边栏个人信息卡片** | 半透明白底 + 回火 | 比纯白更轻盈 |
| **浮窗/弹窗** | 玻璃质感卡片 | 加深透明层次区分 |

#### CSS 实现

```css
/* 导航栏毛玻璃 */
.navbar {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 0.5px solid rgba(192, 221, 151, 0.4);
}

/* 卡片玻璃质感 */
.glass-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 0.5px solid rgba(192, 221, 151, 0.3);
  border-radius: 12px;
}

/* 浮层背景（遮罩） */
.modal-overlay {
  background: rgba(247, 251, 242, 0.8);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
```

#### 原则

- `backdrop-filter: blur()` 值不超过 `12px`，过度模糊会失真
- 透明背景的 `alpha` 值控制在 `0.6~0.85` 之间
- 玻璃卡片**必须**搭配细边框（`0.5px`），否则边缘会模糊不清
- 后台管理界面**不使用**玻璃质感，保持干净利落的操作界面

### 9.4 间距系统

```css
--space-xs:  4px;
--space-sm:  8px;
--space-md:  16px;
--space-lg:  24px;
--space-xl:  32px;
--space-2xl: 48px;
```

### 9.5 字体

```css
--font-sans:  'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui;
--font-mono:  'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
--font-serif: 'Noto Serif SC', 'Source Han Serif SC', serif;
```

---

## 10. 环境配置

### 本地开发

```properties
# application-dev.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/liubaicode?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: root
    password: ${DB_PASSWORD}
  data:
    redis:
      host: localhost
      port: 6379
```

### 环境区分

| 环境 | 配置文件 | 用途 |
|------|---------|------|
| dev | `application-dev.yml` | 本地开发 |
| prod | `application-prod.yml` | 生产部署 |

---

> 本文档是「留白code」开发过程中的"军规"，随着项目进展持续补充完善。
