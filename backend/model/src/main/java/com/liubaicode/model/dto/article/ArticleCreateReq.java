package com.liubaicode.model.dto.article;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;

@Data
public class ArticleCreateReq {

    @NotBlank(message = "title is required")
    @Size(max = 200, message = "title must be at most 200 characters")
    private String title;

    @Size(max = 500, message = "summary must be at most 500 characters")
    private String summary;

    @NotBlank(message = "contentMd is required")
    private String contentMd;

    private String contentHtml;

    @Size(max = 500, message = "coverImage must be at most 500 characters")
    private String coverImage;

    @NotNull(message = "status is required")
    private Integer status;

    private List<Long> tagIds;
}
