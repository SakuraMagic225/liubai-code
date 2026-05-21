package com.liubaicode.model.dto.article;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ArticleStatusUpdateReq {

    @NotNull(message = "status is required")
    private Integer status;
}
