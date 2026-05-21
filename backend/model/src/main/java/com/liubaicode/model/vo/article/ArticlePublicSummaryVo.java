package com.liubaicode.model.vo.article;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class ArticlePublicSummaryVo {

    private Long id;

    private String title;

    private String summary;

    private LocalDateTime publishedAt;

    private LocalDateTime updatedAt;

    private List<String> tags;

    private Boolean featured;

    private Integer readMinutes;

    private String coverImage;

    private Integer viewCount;
}
