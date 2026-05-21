package com.liubaicode.model.vo.article;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ArticlePublicDetailVo extends ArticlePublicSummaryVo {

    private String content;

    private ArticlePublicSummaryVo previousArticle;

    private ArticlePublicSummaryVo nextArticle;
}
