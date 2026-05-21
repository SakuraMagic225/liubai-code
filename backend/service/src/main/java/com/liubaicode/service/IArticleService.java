package com.liubaicode.service;

import com.liubaicode.common.result.PageResult;
import com.liubaicode.model.dto.article.ArticleAdminQueryReq;
import com.liubaicode.model.dto.article.ArticlePublicQueryReq;
import com.liubaicode.model.dto.article.ArticleCreateReq;
import com.liubaicode.model.dto.article.ArticleStatusUpdateReq;
import com.liubaicode.model.dto.article.ArticleUpdateReq;
import com.liubaicode.model.vo.archive.ArchiveVo;
import com.liubaicode.model.vo.article.ArticleAdminDetailVo;
import com.liubaicode.model.vo.article.ArticleAdminListItemVo;
import com.liubaicode.model.vo.article.ArticleHomeVo;
import com.liubaicode.model.vo.article.ArticlePublicDetailVo;
import com.liubaicode.model.vo.article.ArticlePublicSummaryVo;
import com.liubaicode.model.vo.tag.TagPublicVo;
import java.util.List;

public interface IArticleService {

    PageResult<ArticleAdminListItemVo> pageAdminArticles(ArticleAdminQueryReq queryReq);

    PageResult<ArticlePublicSummaryVo> pagePublicArticles(ArticlePublicQueryReq queryReq);

    ArticleAdminDetailVo getAdminArticleDetail(Long id);

    ArticlePublicDetailVo getPublicArticleDetail(Long id);

    ArticleHomeVo getHomeData();

    ArchiveVo getArchiveData();

    List<TagPublicVo> getPublicTags();

    Long createArticle(ArticleCreateReq createReq);

    void updateArticle(Long id, ArticleUpdateReq updateReq);

    void updateArticleStatus(Long id, ArticleStatusUpdateReq statusUpdateReq);

    void deleteArticle(Long id);
}
