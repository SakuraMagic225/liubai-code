package com.liubaicode.controller.admin;

import com.liubaicode.common.constant.AppConstants;
import com.liubaicode.common.result.Result;
import com.liubaicode.model.dto.tag.TagCreateReq;
import com.liubaicode.model.dto.tag.TagUpdateReq;
import com.liubaicode.model.vo.tag.TagAdminVo;
import com.liubaicode.service.ITagService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConstants.API_PREFIX + "/admin/tags")
public class AdminTagController {

    private final ITagService tagService;

    public AdminTagController(ITagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public Result<List<TagAdminVo>> listTags(@RequestParam(required = false) String keyword) {
        return Result.success(tagService.listAdminTags(keyword));
    }

    @GetMapping("/{id}")
    public Result<TagAdminVo> getTagDetail(@PathVariable Long id) {
        return Result.success(tagService.getAdminTagDetail(id));
    }

    @PostMapping
    public Result<Long> createTag(@Valid @RequestBody TagCreateReq createReq) {
        return Result.success(tagService.createTag(createReq));
    }

    @PutMapping("/{id}")
    public Result<Void> updateTag(@PathVariable Long id, @Valid @RequestBody TagUpdateReq updateReq) {
        tagService.updateTag(id, updateReq);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return Result.success();
    }
}
