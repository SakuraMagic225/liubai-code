# 留白code

用代码留白，为思考赋能。

## 项目状态

- `frontend/`：React 18 + TypeScript + Vite + Tailwind CSS
- `backend/`：Spring Boot 3.x + Java 17 + Maven 多模块
- 已具备前台文章浏览、后台文章管理、标签管理、站点设置、头像裁剪、后台登录鉴权

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

本地访问：

```text
http://localhost:5173
```

## Docker Compose 生产部署

部署形态：MySQL + Spring Boot 后端 + Nginx 前端/HTTPS 反代，适合单台云服务器。

### 服务器准备

- Docker 与 Docker Compose
- 域名已解析到服务器
- 已准备 HTTPS 证书文件
- 服务器安全组开放 `80`、`443`

### 配置环境变量

复制环境变量示例：

```bash
cp .env.example .env
```

编辑 `.env`，至少替换：

```env
DOMAIN_NAME=你的域名
MYSQL_ROOT_PASSWORD=强随机 root 密码
DB_PASSWORD=强随机业务库密码
JWT_SECRET=至少 32 位强随机字符串
```

### 放置证书

将证书放到固定路径：

```text
deploy/certs/fullchain.pem
deploy/certs/privkey.pem
```

`deploy/certs/` 下的真实证书不会进入 Git。

### 启动服务

```bash
docker compose config
docker compose build
docker compose up -d
```

查看状态：

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f nginx
```

### 初始化管理员

先生成 BCrypt 密码哈希。可以在本机或服务器执行：

```bash
docker run --rm maven:3.9-eclipse-temurin-17 sh -lc '
mvn -q dependency:get -Dartifact=org.springframework.security:spring-security-crypto:6.3.6 -Dtransitive=false
mvn -q dependency:get -Dartifact=org.springframework:spring-jcl:6.1.16 -Dtransitive=false
jshell --class-path "$HOME/.m2/repository/org/springframework/security/spring-security-crypto/6.3.6/spring-security-crypto-6.3.6.jar:$HOME/.m2/repository/org/springframework/spring-jcl/6.1.16/spring-jcl-6.1.16.jar" <<EOF
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
System.out.println(new BCryptPasswordEncoder().encode("把这里换成你的强密码"));
/exit
EOF
'
```

生成后复制 `backend/sql/admin-user-example.sql` 的内容，将 `$2a$10$REPLACE_WITH_YOUR_BCRYPT_HASH` 替换为真实哈希，然后进入 MySQL 容器执行：

```bash
docker compose exec -T mysql mysql -u"$DB_USERNAME" -p"$DB_PASSWORD" "$DB_NAME" < backend/sql/admin-user-example.sql
```

不要把真实密码或真实哈希提交到 Git。

### 验证

```bash
curl -I https://你的域名/
curl https://你的域名/api/v1/articles
curl -i https://你的域名/api/v1/admin/articles
```

预期：

- 前台页面可以打开
- 公开文章接口返回 `code: 200`
- 未登录访问后台接口返回 `401`
- `https://你的域名/admin/login` 可以登录后台

## 安全提醒

- 不要提交 `.env`
- 不要提交 `deploy/certs/` 中的证书
- 不要提交 `uploads/`
- 生产环境必须替换 `JWT_SECRET`
- MySQL 不要暴露公网端口
