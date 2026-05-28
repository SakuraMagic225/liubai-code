CREATE DATABASE IF NOT EXISTS liubaicode
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE liubaicode;

CREATE TABLE IF NOT EXISTS article (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT 'Article title',
    summary VARCHAR(500) NULL COMMENT 'Article summary',
    content_md MEDIUMTEXT NOT NULL COMMENT 'Markdown content',
    content_html MEDIUMTEXT NULL COMMENT 'Rendered HTML content',
    cover_image VARCHAR(500) NULL COMMENT 'Cover image URL',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=draft, 1=published',
    view_count INT NOT NULL DEFAULT 0 COMMENT 'View count',
    is_deleted TINYINT NOT NULL DEFAULT 0 COMMENT '0=normal, 1=deleted',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_article_status (status),
    INDEX idx_article_created_at (created_at),
    INDEX idx_article_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Article table';

CREATE TABLE IF NOT EXISTS tag (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT 'Tag name',
    color VARCHAR(32) NULL COMMENT 'Tag color',
    is_deleted TINYINT NOT NULL DEFAULT 0 COMMENT '0=normal, 1=deleted',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_tag_name_deleted (name, is_deleted),
    INDEX idx_tag_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tag table';

CREATE TABLE IF NOT EXISTS article_tag (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    article_id BIGINT NOT NULL COMMENT 'Article ID',
    tag_id BIGINT NOT NULL COMMENT 'Tag ID',
    is_deleted TINYINT NOT NULL DEFAULT 0 COMMENT '0=normal, 1=deleted',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_article_tag_deleted (article_id, tag_id, is_deleted),
    INDEX idx_article_tag_article_id (article_id),
    INDEX idx_article_tag_tag_id (tag_id),
    INDEX idx_article_tag_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Article tag relation table';

CREATE TABLE IF NOT EXISTS site_setting (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL COMMENT 'Setting key',
    setting_value TEXT NULL COMMENT 'Setting value',
    description VARCHAR(255) NULL COMMENT 'Setting description',
    is_deleted TINYINT NOT NULL DEFAULT 0 COMMENT '0=normal, 1=deleted',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_site_setting_key_deleted (setting_key, is_deleted),
    INDEX idx_site_setting_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Site setting table';

CREATE TABLE IF NOT EXISTS admin_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL COMMENT 'Admin username',
    password_hash VARCHAR(100) NOT NULL COMMENT 'BCrypt password hash',
    nickname VARCHAR(50) NULL COMMENT 'Admin nickname',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '0=disabled, 1=enabled',
    last_login_at DATETIME NULL COMMENT 'Last login time',
    is_deleted TINYINT NOT NULL DEFAULT 0 COMMENT '0=normal, 1=deleted',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_admin_user_username_deleted (username, is_deleted),
    INDEX idx_admin_user_status (status),
    INDEX idx_admin_user_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Admin user table';
