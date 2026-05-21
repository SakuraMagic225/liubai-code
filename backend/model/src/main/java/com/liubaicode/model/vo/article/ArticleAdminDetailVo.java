package com.liubaicode.model.vo.article;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class ArticleAdminDetailVo {

    private Long id;

    private String title;

    private String summary;

    private String contentMd;

    private String contentHtml;

    private String coverImage;

    private Integer status;

    private Integer viewCount;

    private List<Long> tagIds;

    private List<String> tagNames;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
