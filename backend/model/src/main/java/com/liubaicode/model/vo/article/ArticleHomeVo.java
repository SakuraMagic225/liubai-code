package com.liubaicode.model.vo.article;

import com.liubaicode.model.vo.tag.TagPublicVo;
import java.util.List;
import lombok.Data;

@Data
public class ArticleHomeVo {

    private ArticlePublicSummaryVo featuredArticle;

    private List<ArticlePublicSummaryVo> latestArticles;

    private List<TagPublicVo> tags;

    private HomeStatsVo stats;
}
