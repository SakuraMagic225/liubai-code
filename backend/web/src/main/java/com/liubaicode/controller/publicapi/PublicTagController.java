package com.liubaicode.controller.publicapi;

import com.liubaicode.common.constant.AppConstants;
import com.liubaicode.common.result.Result;
import com.liubaicode.model.vo.tag.TagPublicVo;
import com.liubaicode.service.IArticleService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConstants.API_PREFIX + "/tags")
public class PublicTagController {

    private final IArticleService articleService;

    public PublicTagController(IArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public Result<List<TagPublicVo>> getTags() {
        return Result.success(articleService.getPublicTags());
    }
}
