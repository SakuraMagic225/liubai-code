package com.liubaicode.model.enums;

public enum ArticleStatus {

    DRAFT(0),
    PUBLISHED(1);

    private final Integer code;

    ArticleStatus(Integer code) {
        this.code = code;
    }

    public Integer getCode() {
        return code;
    }
}
