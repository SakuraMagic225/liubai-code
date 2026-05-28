package com.liubaicode.model.dto.site;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SiteProfileReq {

    @NotBlank(message = "昵称不能为空")
    @Size(max = 50, message = "昵称不能超过 50 个字符")
    private String name;

    @NotBlank(message = "身份标题不能为空")
    @Size(max = 100, message = "身份标题不能超过 100 个字符")
    private String title;

    @NotBlank(message = "简介不能为空")
    @Size(max = 1000, message = "简介不能超过 1000 个字符")
    private String bio;

    @Size(max = 500, message = "头像地址不能超过 500 个字符")
    private String avatarUrl;

    @Size(max = 500, message = "GitHub 地址不能超过 500 个字符")
    private String githubUrl;

    @Size(max = 100, message = "邮箱不能超过 100 个字符")
    private String email;

    @Size(max = 500, message = "RSS 地址不能超过 500 个字符")
    private String rssUrl;
}
