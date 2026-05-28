# 留白code

一个面向个人技术写作的全栈博客项目。前台提供文章浏览、归档与个人展示，后台提供文章、标签、站点资料和登录鉴权管理。

项目仍在持续迭代中，当前版本已经具备可部署的 MVP 能力。

## 功能概览

- 前台：首页、文章列表、文章详情、归档页、关于页
- 内容：Markdown 渲染、代码高亮、目录导航、上一篇/下一篇
- 后台：文章管理、标签管理、站点设置、头像上传与裁剪
- 鉴权：管理员登录、BCrypt 密码、JWT Bearer Token
- 部署：Docker Compose、Nginx HTTPS、MySQL、上传文件持久化

## 技术栈

**Frontend**

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

**Backend**

- Java 17
- Spring Boot 3
- Maven 多模块
- MyBatis-Plus
- MySQL

## 目录结构

```text
liubai-code
├── frontend/          # React 前台与后台管理页面
├── backend/           # Spring Boot 多模块后端
├── deploy/            # Docker 与 Nginx 部署配置
├── docs/              # 项目文档
└── docker-compose.yml # 生产部署编排
```

## 本地开发

前端：

```bash
pnpm --dir frontend install
pnpm --dir frontend dev
```

后端：

```bash
mvn -s backend/.mvn/maven-settings.xml -f backend/pom.xml package
java -jar backend/web/target/web-0.1.0-SNAPSHOT.jar
```

默认访问：

```text
http://localhost:5173
```

## 数据库

首次使用前需要创建数据库表：

```sql
source backend/sql/schema.sql;
```

管理员账号使用 `backend/sql/admin-user-example.sql` 作为模板。请自行生成 BCrypt 密码哈希，不要提交真实密码或真实哈希。

## 部署

生产部署推荐使用 Docker Compose：

```bash
cp .env.example .env
docker compose config
docker compose build
docker compose up -d
```

详细步骤见 [部署文档](docs/deployment.md)。

## 安全提示

以下内容不要提交到 Git：

- `.env`
- `deploy/certs/` 下的真实证书
- `uploads/`
- 数据库数据卷
- 任何真实密码、真实 Token、真实 JWT_SECRET

生产环境请务必替换：

- 数据库密码
- 管理员密码
- `JWT_SECRET`

## 当前阶段

项目已经完成个人博客 MVP 的核心闭环：前台浏览、后台管理、登录鉴权和 Docker 部署配置。后续可以继续补充 SEO、RSS、评论、图片管理、密码修改、CI/CD 等能力。
