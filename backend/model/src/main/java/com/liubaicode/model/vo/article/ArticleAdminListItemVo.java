package com.liubaicode.model.vo.article;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class ArticleAdminListItemVo {

    private Long id;

    private String title;

    private String summary;

    private String coverImage;

    private Integer status;

    private Integer viewCount;

    private List<String> tagNames;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
