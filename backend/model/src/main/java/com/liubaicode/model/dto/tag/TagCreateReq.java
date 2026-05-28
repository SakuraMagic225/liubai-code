package com.liubaicode.model.dto.tag;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TagCreateReq {

    @NotBlank(message = "name is required")
    @Size(max = 50, message = "name must be no more than 50 characters")
    private String name;

    @Pattern(regexp = "^$|^#[0-9A-Fa-f]{6}$", message = "color must be a hex color like #EAF3DE")
    private String color;
}
