package com.liubaicode.model.dto.article;

import lombok.Data;

@Data
public class ArticleAdminQueryReq {

    private Integer page = 1;

    private Integer pageSize = 10;

    private Integer status;

    private String keyword;
}
