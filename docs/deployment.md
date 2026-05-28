# 生产部署指南

本文档记录 `留白code` 的 Docker Compose 单机部署方式：MySQL + Spring Boot 后端 + Nginx 前端/HTTPS 反向代理。

## 服务器准备

需要提前准备：

- Docker 和 Docker Compose
- 已解析到服务器的域名
- HTTPS 证书文件
- 开放 `80` 和 `443` 端口

推荐目录：

```text
/opt/liubai-code
```

## 环境变量

复制示例文件：

```bash
cp .env.example .env
```

编辑 `.env`：

```env
DOMAIN_NAME=你的域名

MYSQL_ROOT_PASSWORD=强随机 root 密码
DB_HOST=mysql
DB_PORT=3306
DB_NAME=liubaicode
DB_USERNAME=liubaicode
DB_PASSWORD=强随机业务库密码

JWT_SECRET=至少 32 位强随机字符串
JWT_EXPIRE_HOURS=168
UPLOAD_DIR=/app/uploads
```

说明：

- `MYSQL_ROOT_PASSWORD` 只用于 MySQL 管理员 root。
- `DB_USERNAME` 和 `DB_PASSWORD` 是后端应用连接数据库用的业务账号。
- `JWT_SECRET` 必须在生产环境换成强随机值。

## 证书文件

将证书放到：

```text
deploy/certs/fullchain.pem
deploy/certs/privkey.pem
```

`deploy/certs/` 下的真实证书已被 `.gitignore` 忽略，不会进入 Git。

## 启动

检查配置：

```bash
docker compose config
```

构建并启动：

```bash
docker compose build
docker compose up -d
```

查看状态：

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f nginx
docker compose logs -f mysql
```

## 初始化管理员

先生成 BCrypt 密码哈希。可以在服务器执行：

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

复制 `backend/sql/admin-user-example.sql`，把 `$2a$10$REPLACE_WITH_YOUR_BCRYPT_HASH` 替换成生成的哈希，然后执行：

```bash
docker compose exec -T mysql mysql -u"$DB_USERNAME" -p"$DB_PASSWORD" "$DB_NAME" < backend/sql/admin-user-example.sql
```

不要把真实密码或真实哈希提交到 Git。

## 验证

```bash
curl -I https://你的域名/
curl https://你的域名/api/v1/articles
curl -i https://你的域名/api/v1/admin/articles
```

预期：

- 前台页面可以打开。
- 公开文章接口返回 `code: 200`。
- 未登录访问后台接口返回 `401`。
- `https://你的域名/admin/login` 可以打开后台登录页。

## 常用维护命令

重启服务：

```bash
docker compose restart
```

更新代码后重新构建：

```bash
git pull
docker compose build
docker compose up -d
```

查看后端日志：

```bash
docker compose logs -f backend
```

查看 Nginx 日志：

```bash
docker compose logs -f nginx
```

## 注意事项

- MySQL 不要暴露公网端口。
- 后端 `8080` 不需要暴露公网，由 Nginx 反向代理。
- 上传文件保存在 Docker volume `uploads_data`。
- MySQL 数据保存在 Docker volume `mysql_data`。
- 如果删除 volume，数据库和上传文件会丢失。
