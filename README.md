# 留白code

用代码留白，为思考赋能。

当前阶段完成项目基础骨架与首页：

- `frontend/`：React 18 + TypeScript + Vite + Tailwind CSS
- `backend/`：Spring Boot 3.x + Java 17 + Maven 多模块骨架
- 首页使用前端模拟数据，暂不接入真实后端接口

## 本地开发

```bash
pnpm --dir frontend install
pnpm --dir frontend dev
```

前端默认访问地址：

```text
http://localhost:5173
```

后端构建：

```bash
mvn -s backend/.mvn/maven-settings.xml -f backend/pom.xml package
```

本阶段不包含后台管理、文章详情、文章列表、搜索、归档、RSS、SEO、评论区和真实 API。
