package com.liubaicode.controller.publicapi;

import com.liubaicode.common.constant.AppConstants;
import com.liubaicode.common.result.PageResult;
import com.liubaicode.common.result.Result;
import com.liubaicode.model.dto.article.ArticlePublicQueryReq;
import com.liubaicode.model.vo.archive.ArchiveVo;
import com.liubaicode.model.vo.article.ArticleHomeVo;
import com.liubaicode.model.vo.article.ArticlePublicDetailVo;
import com.liubaicode.model.vo.article.ArticlePublicSummaryVo;
import com.liubaicode.service.IArticleService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConstants.API_PREFIX + "/articles")
public class PublicArticleController {

    private final IArticleService articleService;

    public PublicArticleController(IArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public Result<PageResult<ArticlePublicSummaryVo>> pageArticles(@ModelAttribute ArticlePublicQueryReq queryReq) {
        return Result.success(articleService.pagePublicArticles(queryReq));
    }

    @GetMapping("/home")
    public Result<ArticleHomeVo> getHomeData() {
        return Result.success(articleService.getHomeData());
    }

    @GetMapping("/archive")
    public Result<ArchiveVo> getArchiveData() {
        return Result.success(articleService.getArchiveData());
    }

    @GetMapping("/{id}")
    public Result<ArticlePublicDetailVo> getArticleDetail(@PathVariable Long id) {
        return Result.success(articleService.getPublicArticleDetail(id));
    }
}
