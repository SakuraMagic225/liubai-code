USE liubaicode;

-- 示例账号：admin
-- password_hash 需要填入你自己生成的 BCrypt 哈希，不要提交真实密码或默认密码。
INSERT INTO admin_user (username, password_hash, nickname, status)
VALUES ('admin', '$2a$10$REPLACE_WITH_YOUR_BCRYPT_HASH', '管理员', 1)
ON DUPLICATE KEY UPDATE
    password_hash = VALUES(password_hash),
    nickname = VALUES(nickname),
    status = VALUES(status);
