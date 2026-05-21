package com.liubaicode.controller.admin;

import com.liubaicode.common.constant.AppConstants;
import com.liubaicode.common.result.PageResult;
import com.liubaicode.common.result.Result;
import com.liubaicode.model.dto.article.ArticleAdminQueryReq;
import com.liubaicode.model.dto.article.ArticleCreateReq;
import com.liubaicode.model.dto.article.ArticleStatusUpdateReq;
import com.liubaicode.model.dto.article.ArticleUpdateReq;
import com.liubaicode.model.vo.article.ArticleAdminDetailVo;
import com.liubaicode.model.vo.article.ArticleAdminListItemVo;
import com.liubaicode.service.IArticleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConstants.API_PREFIX + "/admin/articles")
public class AdminArticleController {

    private final IArticleService articleService;

    public AdminArticleController(IArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public Result<PageResult<ArticleAdminListItemVo>> pageArticles(@ModelAttribute ArticleAdminQueryReq queryReq) {
        return Result.success(articleService.pageAdminArticles(queryReq));
    }

    @GetMapping("/{id}")
    public Result<ArticleAdminDetailVo> getArticleDetail(@PathVariable Long id) {
        return Result.success(articleService.getAdminArticleDetail(id));
    }

    @PostMapping
    public Result<Long> createArticle(@Valid @RequestBody ArticleCreateReq createReq) {
        return Result.success(articleService.createArticle(createReq));
    }

    @PutMapping("/{id}")
    public Result<Void> updateArticle(@PathVariable Long id, @Valid @RequestBody ArticleUpdateReq updateReq) {
        articleService.updateArticle(id, updateReq);
        return Result.success();
    }

    @PatchMapping("/{id}/status")
    public Result<Void> updateArticleStatus(
            @PathVariable Long id,
            @Valid @RequestBody ArticleStatusUpdateReq statusUpdateReq
    ) {
        articleService.updateArticleStatus(id, statusUpdateReq);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return Result.success();
    }
}
