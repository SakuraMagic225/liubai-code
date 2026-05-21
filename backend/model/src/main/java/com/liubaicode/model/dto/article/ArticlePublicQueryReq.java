package com.liubaicode.model.dto.article;

import lombok.Data;

@Data
public class ArticlePublicQueryReq {

    private Integer page;

    private Integer pageSize;

    private String tag;

    private String keyword;
}
