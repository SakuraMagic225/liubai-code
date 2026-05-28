package com.liubaicode.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.liubaicode.common.exception.BizException;
import com.liubaicode.common.exception.ErrorCode;
import com.liubaicode.model.dto.tag.TagCreateReq;
import com.liubaicode.model.dto.tag.TagUpdateReq;
import com.liubaicode.model.entity.Article;
import com.liubaicode.model.entity.ArticleTag;
import com.liubaicode.model.entity.Tag;
import com.liubaicode.model.vo.tag.TagAdminVo;
import com.liubaicode.repository.mapper.ArticleMapper;
import com.liubaicode.repository.mapper.ArticleTagMapper;
import com.liubaicode.repository.mapper.TagMapper;
import com.liubaicode.service.ITagService;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class TagServiceImpl implements ITagService {

    private static final int NOT_DELETED = 0;

    private final TagMapper tagMapper;
    private final ArticleMapper articleMapper;
    private final ArticleTagMapper articleTagMapper;

    public TagServiceImpl(TagMapper tagMapper, ArticleMapper articleMapper, ArticleTagMapper articleTagMapper) {
        this.tagMapper = tagMapper;
        this.articleMapper = articleMapper;
        this.articleTagMapper = articleTagMapper;
    }

    @Override
    public List<TagAdminVo> listAdminTags(String keyword) {
        LambdaQueryWrapper<Tag> wrapper = new LambdaQueryWrapper<Tag>()
                .eq(Tag::getIsDeleted, NOT_DELETED)
                .like(StringUtils.hasText(keyword), Tag::getName, keyword == null ? null : keyword.trim())
                .orderByDesc(Tag::getUpdatedAt)
                .orderByDesc(Tag::getId);
        List<Tag> tags = tagMapper.selectList(wrapper);
        Map<Long, Long> countMap = buildArticleCountMap(tags.stream().map(Tag::getId).toList());

        return tags.stream()
                .map(tag -> toAdminVo(tag, countMap.getOrDefault(tag.getId(), 0L)))
                .toList();
    }

    @Override
    public TagAdminVo getAdminTagDetail(Long id) {
        Tag tag = getExistingTag(id);
        Long articleCount = buildArticleCountMap(List.of(id)).getOrDefault(id, 0L);
        return toAdminVo(tag, articleCount);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createTag(TagCreateReq createReq) {
        String name = normalizeName(createReq.getName());
        validateDuplicateName(name, null);

        Tag tag = new Tag();
        tag.setName(name);
        tag.setColor(normalizeColor(createReq.getColor()));
        tag.setIsDeleted(NOT_DELETED);
        tagMapper.insert(tag);
        return tag.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateTag(Long id, TagUpdateReq updateReq) {
        getExistingTag(id);
        String name = normalizeName(updateReq.getName());
        validateDuplicateName(name, id);

        Tag tag = new Tag();
        tag.setId(id);
        tag.setName(name);
        tag.setColor(normalizeColor(updateReq.getColor()));
        tagMapper.updateById(tag);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteTag(Long id) {
        Tag tag = getExistingTag(id);
        long articleCount = buildArticleCountMap(List.of(id)).getOrDefault(id, 0L);
        if (articleCount > 0) {
            throw new BizException(ErrorCode.BAD_REQUEST, "标签已被文章使用，无法删除");
        }

        tagMapper.deleteDeletedTagByName(tag.getName());
        tagMapper.deleteById(id);
    }

    private Tag getExistingTag(Long id) {
        if (id == null) {
            throw new BizException(ErrorCode.BAD_REQUEST, "标签 ID 不能为空");
        }

        Tag tag = tagMapper.selectOne(new LambdaQueryWrapper<Tag>()
                .eq(Tag::getId, id)
                .eq(Tag::getIsDeleted, NOT_DELETED));
        if (tag == null) {
            throw new BizException(ErrorCode.NOT_FOUND, "标签不存在");
        }
        return tag;
    }

    private void validateDuplicateName(String name, Long currentId) {
        Tag existingTag = tagMapper.selectOne(new LambdaQueryWrapper<Tag>()
                .eq(Tag::getIsDeleted, NOT_DELETED)
                .eq(Tag::getName, name));
        if (existingTag != null && !Objects.equals(existingTag.getId(), currentId)) {
            throw new BizException(ErrorCode.BAD_REQUEST, "标签名已存在");
        }
    }

    private Map<Long, Long> buildArticleCountMap(List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return Collections.emptyMap();
        }

        List<ArticleTag> articleTags = articleTagMapper.selectList(new LambdaQueryWrapper<ArticleTag>()
                .in(ArticleTag::getTagId, tagIds)
                .eq(ArticleTag::getIsDeleted, NOT_DELETED));
        if (articleTags.isEmpty()) {
            return Collections.emptyMap();
        }

        List<Long> articleIds = articleTags.stream()
                .map(ArticleTag::getArticleId)
                .distinct()
                .toList();
        Map<Long, Article> articleMap = articleMapper.selectList(new LambdaQueryWrapper<Article>()
                        .in(Article::getId, articleIds)
                        .eq(Article::getIsDeleted, NOT_DELETED))
                .stream()
                .collect(Collectors.toMap(Article::getId, Function.identity()));

        return articleTags.stream()
                .filter(articleTag -> articleMap.containsKey(articleTag.getArticleId()))
                .collect(Collectors.groupingBy(ArticleTag::getTagId, Collectors.counting()));
    }

    private TagAdminVo toAdminVo(Tag tag, Long articleCount) {
        TagAdminVo vo = new TagAdminVo();
        vo.setId(tag.getId());
        vo.setName(tag.getName());
        vo.setColor(tag.getColor());
        vo.setArticleCount(articleCount);
        vo.setCreatedAt(tag.getCreatedAt());
        vo.setUpdatedAt(tag.getUpdatedAt());
        return vo;
    }

    private String normalizeName(String name) {
        return name == null ? "" : name.trim();
    }

    private String normalizeColor(String color) {
        if (!StringUtils.hasText(color)) {
            return null;
        }

        return color.trim();
    }
}
