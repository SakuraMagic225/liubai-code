package com.liubaicode.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.liubaicode.common.exception.BizException;
import com.liubaicode.common.exception.ErrorCode;
import com.liubaicode.common.result.PageResult;
import com.liubaicode.model.dto.article.ArticleAdminQueryReq;
import com.liubaicode.model.dto.article.ArticlePublicQueryReq;
import com.liubaicode.model.dto.article.ArticleCreateReq;
import com.liubaicode.model.dto.article.ArticleStatusUpdateReq;
import com.liubaicode.model.dto.article.ArticleUpdateReq;
import com.liubaicode.model.entity.Article;
import com.liubaicode.model.entity.ArticleTag;
import com.liubaicode.model.entity.Tag;
import com.liubaicode.model.enums.ArticleStatus;
import com.liubaicode.model.vo.archive.ArchiveMonthGroupVo;
import com.liubaicode.model.vo.archive.ArchiveStatsVo;
import com.liubaicode.model.vo.archive.ArchiveVo;
import com.liubaicode.model.vo.archive.ArchiveYearGroupVo;
import com.liubaicode.model.vo.article.ArticleAdminDetailVo;
import com.liubaicode.model.vo.article.ArticleAdminListItemVo;
import com.liubaicode.model.vo.article.ArticleHomeVo;
import com.liubaicode.model.vo.article.ArticlePublicDetailVo;
import com.liubaicode.model.vo.article.ArticlePublicSummaryVo;
import com.liubaicode.model.vo.article.HomeStatsVo;
import com.liubaicode.model.vo.tag.TagPublicVo;
import com.liubaicode.repository.mapper.ArticleMapper;
import com.liubaicode.repository.mapper.ArticleTagMapper;
import com.liubaicode.repository.mapper.TagMapper;
import com.liubaicode.service.IArticleService;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class ArticleServiceImpl implements IArticleService {

    private static final int DEFAULT_PAGE = 1;
    private static final int DEFAULT_PAGE_SIZE = 10;
    private static final int MAX_PAGE_SIZE = 100;
    private static final int DEFAULT_VIEW_COUNT = 0;
    private static final int NOT_DELETED = 0;
    private static final int DELETED = 1;

    private final ArticleMapper articleMapper;
    private final TagMapper tagMapper;
    private final ArticleTagMapper articleTagMapper;

    public ArticleServiceImpl(
            ArticleMapper articleMapper,
            TagMapper tagMapper,
            ArticleTagMapper articleTagMapper
    ) {
        this.articleMapper = articleMapper;
        this.tagMapper = tagMapper;
        this.articleTagMapper = articleTagMapper;
    }

    @Override
    public PageResult<ArticleAdminListItemVo> pageAdminArticles(ArticleAdminQueryReq queryReq) {
        int page = normalizePage(queryReq.getPage());
        int pageSize = normalizePageSize(queryReq.getPageSize());
        Integer status = queryReq.getStatus();
        validateStatusIfPresent(status);

        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<Article>()
                .eq(Article::getIsDeleted, NOT_DELETED)
                .eq(status != null, Article::getStatus, status)
                .and(StringUtils.hasText(queryReq.getKeyword()), nested -> nested
                        .like(Article::getTitle, queryReq.getKeyword().trim())
                        .or()
                        .like(Article::getSummary, queryReq.getKeyword().trim())
                        .or()
                        .like(Article::getContentMd, queryReq.getKeyword().trim()))
                .orderByDesc(Article::getCreatedAt)
                .orderByDesc(Article::getId);

        IPage<Article> articlePage = articleMapper.selectPage(Page.of(page, pageSize), wrapper);
        List<Article> articles = articlePage.getRecords();
        Map<Long, List<String>> tagNameMap = buildTagNameMap(articles.stream().map(Article::getId).toList());
        List<ArticleAdminListItemVo> records = articles.stream()
                .map(article -> toListItemVo(article, tagNameMap.getOrDefault(article.getId(), Collections.emptyList())))
                .toList();
        int totalPages = articlePage.getPages() > Integer.MAX_VALUE ? Integer.MAX_VALUE : (int) articlePage.getPages();

        return new PageResult<>(records, articlePage.getTotal(), page, pageSize, totalPages);
    }

    @Override
    public PageResult<ArticlePublicSummaryVo> pagePublicArticles(ArticlePublicQueryReq queryReq) {
        int page = normalizePage(queryReq.getPage());
        int pageSize = normalizePageSize(queryReq.getPageSize());
        String tag = queryReq.getTag();
        List<Long> taggedArticleIds = selectArticleIdsByTagName(tag);
        if (StringUtils.hasText(tag) && taggedArticleIds.isEmpty()) {
            return new PageResult<>(Collections.emptyList(), 0L, page, pageSize, 0);
        }

        LambdaQueryWrapper<Article> wrapper = publicArticleWrapper()
                .in(!taggedArticleIds.isEmpty(), Article::getId, taggedArticleIds)
                .and(StringUtils.hasText(queryReq.getKeyword()), nested -> nested
                        .like(Article::getTitle, queryReq.getKeyword().trim())
                        .or()
                        .like(Article::getSummary, queryReq.getKeyword().trim())
                        .or()
                        .like(Article::getContentMd, queryReq.getKeyword().trim()));

        IPage<Article> articlePage = articleMapper.selectPage(Page.of(page, pageSize), wrapper);
        List<Article> articles = articlePage.getRecords();
        Map<Long, List<String>> tagNameMap = buildTagNameMap(articles.stream().map(Article::getId).toList());
        List<ArticlePublicSummaryVo> records = articles.stream()
                .map(article -> toPublicSummaryVo(
                        article,
                        tagNameMap.getOrDefault(article.getId(), Collections.emptyList()),
                        false
                ))
                .toList();
        int totalPages = articlePage.getPages() > Integer.MAX_VALUE ? Integer.MAX_VALUE : (int) articlePage.getPages();

        return new PageResult<>(records, articlePage.getTotal(), page, pageSize, totalPages);
    }

    @Override
    public ArticleAdminDetailVo getAdminArticleDetail(Long id) {
        Article article = getExistingArticle(id);
        List<ArticleTag> articleTags = selectActiveArticleTags(List.of(id));
        List<Long> tagIds = articleTags.stream().map(ArticleTag::getTagId).toList();
        Map<Long, Tag> tagMap = selectActiveTags(tagIds).stream()
                .collect(Collectors.toMap(Tag::getId, Function.identity()));
        List<String> tagNames = tagIds.stream()
                .map(tagMap::get)
                .filter(Objects::nonNull)
                .map(Tag::getName)
                .toList();

        return toDetailVo(article, tagIds, tagNames);
    }

    @Override
    public ArticlePublicDetailVo getPublicArticleDetail(Long id) {
        Article article = getExistingPublicArticle(id);
        List<Article> publishedArticles = selectPublishedArticles();
        Map<Long, List<String>> tagNameMap = buildTagNameMap(publishedArticles.stream().map(Article::getId).toList());
        List<ArticlePublicSummaryVo> summaries = publishedArticles.stream()
                .map(item -> toPublicSummaryVo(
                        item,
                        tagNameMap.getOrDefault(item.getId(), Collections.emptyList()),
                        Objects.equals(item.getId(), publishedArticles.get(0).getId())
                ))
                .toList();
        int currentIndex = -1;
        for (int index = 0; index < summaries.size(); index++) {
            if (Objects.equals(summaries.get(index).getId(), article.getId())) {
                currentIndex = index;
                break;
            }
        }

        ArticlePublicDetailVo vo = toPublicDetailVo(
                article,
                tagNameMap.getOrDefault(article.getId(), Collections.emptyList()),
                currentIndex == 0
        );
        if (currentIndex >= 0) {
            vo.setPreviousArticle(currentIndex + 1 < summaries.size() ? summaries.get(currentIndex + 1) : null);
            vo.setNextArticle(currentIndex > 0 ? summaries.get(currentIndex - 1) : null);
        }

        return vo;
    }

    @Override
    public ArticleHomeVo getHomeData() {
        List<Article> latestArticles = articleMapper.selectList(publicArticleWrapper().last("LIMIT 5"));
        Map<Long, List<String>> tagNameMap = buildTagNameMap(latestArticles.stream().map(Article::getId).toList());
        List<ArticlePublicSummaryVo> latest = latestArticles.stream()
                .map(article -> toPublicSummaryVo(
                        article,
                        tagNameMap.getOrDefault(article.getId(), Collections.emptyList()),
                        Objects.equals(article.getId(), latestArticles.get(0).getId())
                ))
                .toList();

        HomeStatsVo stats = new HomeStatsVo();
        List<Article> allPublished = selectPublishedArticles();
        stats.setArticleCount((long) allPublished.size());
        stats.setTagCount(getPublicTags().size());
        stats.setViewCount(allPublished.stream()
                .map(Article::getViewCount)
                .filter(Objects::nonNull)
                .mapToLong(Integer::longValue)
                .sum());

        ArticleHomeVo vo = new ArticleHomeVo();
        vo.setFeaturedArticle(latest.isEmpty() ? null : latest.get(0));
        vo.setLatestArticles(latest);
        vo.setTags(getPublicTags());
        vo.setStats(stats);
        return vo;
    }

    @Override
    public ArchiveVo getArchiveData() {
        List<Article> articles = selectPublishedArticles();
        Map<Long, List<String>> tagNameMap = buildTagNameMap(articles.stream().map(Article::getId).toList());
        Map<Integer, Map<Integer, List<ArticlePublicSummaryVo>>> grouped = articles.stream()
                .filter(article -> article.getCreatedAt() != null)
                .map(article -> toPublicSummaryVo(
                        article,
                        tagNameMap.getOrDefault(article.getId(), Collections.emptyList()),
                        false
                ))
                .collect(Collectors.groupingBy(
                        article -> article.getPublishedAt().getYear(),
                        () -> new LinkedHashMap<>(),
                        Collectors.groupingBy(
                                article -> article.getPublishedAt().getMonthValue(),
                                () -> new LinkedHashMap<>(),
                                Collectors.toList()
                        )
                ));

        List<ArchiveYearGroupVo> yearGroups = grouped.entrySet().stream()
                .sorted(Map.Entry.<Integer, Map<Integer, List<ArticlePublicSummaryVo>>>comparingByKey().reversed())
                .map(yearEntry -> {
                    ArchiveYearGroupVo yearGroup = new ArchiveYearGroupVo();
                    yearGroup.setYear(yearEntry.getKey());
                    List<ArchiveMonthGroupVo> months = yearEntry.getValue().entrySet().stream()
                            .sorted(Map.Entry.<Integer, List<ArticlePublicSummaryVo>>comparingByKey().reversed())
                            .map(monthEntry -> {
                                ArchiveMonthGroupVo monthGroup = new ArchiveMonthGroupVo();
                                monthGroup.setMonth(monthEntry.getKey());
                                monthGroup.setArticles(monthEntry.getValue());
                                return monthGroup;
                            })
                            .toList();
                    yearGroup.setMonths(months);
                    return yearGroup;
                })
                .toList();

        ArchiveStatsVo stats = new ArchiveStatsVo();
        stats.setArticleCount((long) articles.size());
        stats.setYearCount(yearGroups.size());
        stats.setTagCount(getPublicTags().size());

        ArchiveVo vo = new ArchiveVo();
        vo.setGroups(yearGroups);
        vo.setStats(stats);
        return vo;
    }

    @Override
    public List<TagPublicVo> getPublicTags() {
        List<Article> articles = selectPublishedArticles();
        List<Long> articleIds = articles.stream().map(Article::getId).toList();
        if (articleIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<ArticleTag> articleTags = selectActiveArticleTags(articleIds);
        Map<Long, Long> countMap = articleTags.stream().collect(Collectors.groupingBy(
                ArticleTag::getTagId,
                Collectors.counting()
        ));
        List<Tag> tags = selectActiveTags(new ArrayList<>(countMap.keySet()));

        return tags.stream()
                .map(tag -> {
                    TagPublicVo vo = new TagPublicVo();
                    vo.setId(tag.getId());
                    vo.setName(tag.getName());
                    vo.setColor(tag.getColor());
                    vo.setCount(countMap.getOrDefault(tag.getId(), 0L));
                    return vo;
                })
                .sorted(Comparator.comparing(TagPublicVo::getCount).reversed().thenComparing(TagPublicVo::getId))
                .toList();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createArticle(ArticleCreateReq createReq) {
        validateStatus(createReq.getStatus());
        List<Long> tagIds = normalizeTagIds(createReq.getTagIds());
        validateTagIds(tagIds);

        Article article = new Article();
        article.setTitle(createReq.getTitle());
        article.setSummary(createReq.getSummary());
        article.setContentMd(createReq.getContentMd());
        article.setContentHtml(createReq.getContentHtml());
        article.setCoverImage(createReq.getCoverImage());
        article.setStatus(createReq.getStatus());
        article.setViewCount(DEFAULT_VIEW_COUNT);
        article.setIsDeleted(NOT_DELETED);
        articleMapper.insert(article);
        replaceArticleTags(article.getId(), tagIds);

        return article.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateArticle(Long id, ArticleUpdateReq updateReq) {
        getExistingArticle(id);
        validateStatus(updateReq.getStatus());
        List<Long> tagIds = normalizeTagIds(updateReq.getTagIds());
        validateTagIds(tagIds);

        Article article = new Article();
        article.setId(id);
        article.setTitle(updateReq.getTitle());
        article.setSummary(updateReq.getSummary());
        article.setContentMd(updateReq.getContentMd());
        article.setContentHtml(updateReq.getContentHtml());
        article.setCoverImage(updateReq.getCoverImage());
        article.setStatus(updateReq.getStatus());
        articleMapper.updateById(article);
        replaceArticleTags(id, tagIds);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateArticleStatus(Long id, ArticleStatusUpdateReq statusUpdateReq) {
        getExistingArticle(id);
        validateStatus(statusUpdateReq.getStatus());

        Article article = new Article();
        article.setId(id);
        article.setStatus(statusUpdateReq.getStatus());
        articleMapper.updateById(article);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteArticle(Long id) {
        getExistingArticle(id);
        articleMapper.deleteById(id);
        articleTagMapper.update(
                null,
                new LambdaUpdateWrapper<ArticleTag>()
                        .eq(ArticleTag::getArticleId, id)
                        .eq(ArticleTag::getIsDeleted, NOT_DELETED)
                        .set(ArticleTag::getIsDeleted, DELETED)
        );
    }

    private Article getExistingPublicArticle(Long id) {
        if (id == null) {
            throw new BizException(ErrorCode.BAD_REQUEST, "Article ID is required");
        }

        Article article = articleMapper.selectOne(publicArticleWrapper()
                .eq(Article::getId, id));
        if (article == null) {
            throw new BizException(ErrorCode.NOT_FOUND, "Article not found");
        }

        return article;
    }

    private Article getExistingArticle(Long id) {
        if (id == null) {
            throw new BizException(ErrorCode.BAD_REQUEST, "Article ID is required");
        }

        Article article = articleMapper.selectOne(new LambdaQueryWrapper<Article>()
                .eq(Article::getId, id)
                .eq(Article::getIsDeleted, NOT_DELETED));
        if (article == null) {
            throw new BizException(ErrorCode.NOT_FOUND, "Article not found");
        }

        return article;
    }

    private LambdaQueryWrapper<Article> publicArticleWrapper() {
        return new LambdaQueryWrapper<Article>()
                .eq(Article::getIsDeleted, NOT_DELETED)
                .eq(Article::getStatus, ArticleStatus.PUBLISHED.getCode())
                .orderByDesc(Article::getCreatedAt)
                .orderByDesc(Article::getId);
    }

    private List<Article> selectPublishedArticles() {
        return articleMapper.selectList(publicArticleWrapper());
    }

    private List<Long> selectArticleIdsByTagName(String tagName) {
        if (!StringUtils.hasText(tagName)) {
            return Collections.emptyList();
        }

        Tag tag = tagMapper.selectOne(new LambdaQueryWrapper<Tag>()
                .eq(Tag::getIsDeleted, NOT_DELETED)
                .eq(Tag::getName, tagName.trim()));
        if (tag == null) {
            return Collections.emptyList();
        }

        return articleTagMapper.selectList(new LambdaQueryWrapper<ArticleTag>()
                        .eq(ArticleTag::getTagId, tag.getId())
                        .eq(ArticleTag::getIsDeleted, NOT_DELETED))
                .stream()
                .map(ArticleTag::getArticleId)
                .distinct()
                .toList();
    }

    private void replaceArticleTags(Long articleId, List<Long> tagIds) {
        Set<Long> nextTagIdSet = new LinkedHashSet<>(tagIds);
        List<ArticleTag> currentArticleTags = selectActiveArticleTags(List.of(articleId));
        Set<Long> currentTagIdSet = currentArticleTags.stream()
                .map(ArticleTag::getTagId)
                .collect(Collectors.toSet());

        for (ArticleTag articleTag : currentArticleTags) {
            Long tagId = articleTag.getTagId();
            if (!nextTagIdSet.contains(tagId)) {
                articleTagMapper.deleteDeletedRelation(articleId, tagId);
                articleTagMapper.update(
                        null,
                        new LambdaUpdateWrapper<ArticleTag>()
                                .eq(ArticleTag::getId, articleTag.getId())
                                .eq(ArticleTag::getIsDeleted, NOT_DELETED)
                                .set(ArticleTag::getIsDeleted, DELETED)
                );
            }
        }

        for (Long tagId : tagIds) {
            if (currentTagIdSet.contains(tagId)) {
                continue;
            }

            ArticleTag articleTag = new ArticleTag();
            articleTag.setArticleId(articleId);
            articleTag.setTagId(tagId);
            articleTag.setIsDeleted(NOT_DELETED);
            articleTagMapper.insert(articleTag);
        }
    }

    private List<Long> normalizeTagIds(List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return Collections.emptyList();
        }

        return tagIds.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.collectingAndThen(
                        Collectors.toCollection(LinkedHashSet::new),
                        ArrayList::new
                ));
    }

    private void validateTagIds(List<Long> tagIds) {
        if (tagIds.isEmpty()) {
            return;
        }

        List<Tag> tags = selectActiveTags(tagIds);
        Set<Long> existingTagIds = tags.stream().map(Tag::getId).collect(Collectors.toSet());
        List<Long> missingTagIds = tagIds.stream()
                .filter(tagId -> !existingTagIds.contains(tagId))
                .toList();
        if (!missingTagIds.isEmpty()) {
            throw new BizException(ErrorCode.BAD_REQUEST, "Tag does not exist: " + missingTagIds);
        }
    }

    private List<Tag> selectActiveTags(List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return Collections.emptyList();
        }

        return tagMapper.selectList(new LambdaQueryWrapper<Tag>()
                .in(Tag::getId, tagIds)
                .eq(Tag::getIsDeleted, NOT_DELETED));
    }

    private Map<Long, List<String>> buildTagNameMap(List<Long> articleIds) {
        if (articleIds.isEmpty()) {
            return Collections.emptyMap();
        }

        List<ArticleTag> articleTags = selectActiveArticleTags(articleIds);
        List<Long> tagIds = articleTags.stream()
                .map(ArticleTag::getTagId)
                .distinct()
                .toList();
        Map<Long, Tag> tagMap = selectActiveTags(tagIds).stream()
                .collect(Collectors.toMap(Tag::getId, Function.identity()));

        return articleTags.stream().collect(Collectors.groupingBy(
                ArticleTag::getArticleId,
                Collectors.mapping(
                        articleTag -> tagMap.get(articleTag.getTagId()),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                tags -> tags.stream()
                                        .filter(Objects::nonNull)
                                        .map(Tag::getName)
                                        .toList()
                        )
                )
        ));
    }

    private List<ArticleTag> selectActiveArticleTags(List<Long> articleIds) {
        if (articleIds == null || articleIds.isEmpty()) {
            return Collections.emptyList();
        }

        return articleTagMapper.selectList(new LambdaQueryWrapper<ArticleTag>()
                .in(ArticleTag::getArticleId, articleIds)
                .eq(ArticleTag::getIsDeleted, NOT_DELETED)
                .orderByAsc(ArticleTag::getId));
    }

    private ArticleAdminListItemVo toListItemVo(Article article, List<String> tagNames) {
        ArticleAdminListItemVo vo = new ArticleAdminListItemVo();
        vo.setId(article.getId());
        vo.setTitle(article.getTitle());
        vo.setSummary(article.getSummary());
        vo.setCoverImage(article.getCoverImage());
        vo.setStatus(article.getStatus());
        vo.setViewCount(article.getViewCount());
        vo.setTagNames(tagNames);
        vo.setCreatedAt(article.getCreatedAt());
        vo.setUpdatedAt(article.getUpdatedAt());
        return vo;
    }

    private ArticleAdminDetailVo toDetailVo(Article article, List<Long> tagIds, List<String> tagNames) {
        ArticleAdminDetailVo vo = new ArticleAdminDetailVo();
        vo.setId(article.getId());
        vo.setTitle(article.getTitle());
        vo.setSummary(article.getSummary());
        vo.setContentMd(article.getContentMd());
        vo.setContentHtml(article.getContentHtml());
        vo.setCoverImage(article.getCoverImage());
        vo.setStatus(article.getStatus());
        vo.setViewCount(article.getViewCount());
        vo.setTagIds(tagIds);
        vo.setTagNames(tagNames);
        vo.setCreatedAt(article.getCreatedAt());
        vo.setUpdatedAt(article.getUpdatedAt());
        return vo;
    }

    private ArticlePublicSummaryVo toPublicSummaryVo(Article article, List<String> tagNames, boolean featured) {
        ArticlePublicSummaryVo vo = new ArticlePublicSummaryVo();
        vo.setId(article.getId());
        vo.setTitle(article.getTitle());
        vo.setSummary(article.getSummary());
        vo.setPublishedAt(article.getCreatedAt());
        vo.setUpdatedAt(article.getUpdatedAt());
        vo.setTags(tagNames);
        vo.setFeatured(featured);
        vo.setReadMinutes(estimateReadMinutes(article.getContentMd()));
        vo.setCoverImage(article.getCoverImage());
        vo.setViewCount(article.getViewCount());
        return vo;
    }

    private ArticlePublicDetailVo toPublicDetailVo(Article article, List<String> tagNames, boolean featured) {
        ArticlePublicSummaryVo summary = toPublicSummaryVo(article, tagNames, featured);
        ArticlePublicDetailVo vo = new ArticlePublicDetailVo();
        vo.setId(summary.getId());
        vo.setTitle(summary.getTitle());
        vo.setSummary(summary.getSummary());
        vo.setPublishedAt(summary.getPublishedAt());
        vo.setUpdatedAt(summary.getUpdatedAt());
        vo.setTags(summary.getTags());
        vo.setFeatured(summary.getFeatured());
        vo.setReadMinutes(summary.getReadMinutes());
        vo.setCoverImage(summary.getCoverImage());
        vo.setViewCount(summary.getViewCount());
        vo.setContent(article.getContentMd());
        return vo;
    }

    private int estimateReadMinutes(String content) {
        if (!StringUtils.hasText(content)) {
            return 1;
        }

        String normalized = content
                .replaceAll("```[\\s\\S]*?```", "")
                .replaceAll("[#>*_`\\-\\[\\]()|]", "")
                .replaceAll("\\s+", "");
        return Math.max(1, (int) Math.ceil(normalized.length() / 450.0));
    }

    private void validateStatusIfPresent(Integer status) {
        if (status != null) {
            validateStatus(status);
        }
    }

    private void validateStatus(Integer status) {
        if (!Objects.equals(status, ArticleStatus.DRAFT.getCode())
                && !Objects.equals(status, ArticleStatus.PUBLISHED.getCode())) {
            throw new BizException(ErrorCode.BAD_REQUEST, "Article status must be 0 or 1");
        }
    }

    private int normalizePage(Integer page) {
        if (page == null || page < 1) {
            return DEFAULT_PAGE;
        }
        return page;
    }

    private int normalizePageSize(Integer pageSize) {
        if (pageSize == null || pageSize < 1) {
            return DEFAULT_PAGE_SIZE;
        }
        return Math.min(pageSize, MAX_PAGE_SIZE);
    }
}
