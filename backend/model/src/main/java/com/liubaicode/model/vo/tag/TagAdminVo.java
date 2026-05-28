package com.liubaicode.model.vo.tag;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class TagAdminVo {

    private Long id;

    private String name;

    private String color;

    private Long articleCount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
