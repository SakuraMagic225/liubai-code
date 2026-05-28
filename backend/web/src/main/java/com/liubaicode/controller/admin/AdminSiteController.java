package com.liubaicode.controller.admin;

import com.liubaicode.common.constant.AppConstants;
import com.liubaicode.common.exception.BizException;
import com.liubaicode.common.exception.ErrorCode;
import com.liubaicode.common.result.Result;
import com.liubaicode.model.dto.site.SiteProfileReq;
import com.liubaicode.model.vo.site.AvatarUploadVo;
import com.liubaicode.model.vo.site.SiteProfileVo;
import com.liubaicode.service.ISiteSettingService;
import jakarta.validation.Valid;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(AppConstants.API_PREFIX + "/admin/site")
public class AdminSiteController {

    private static final long MAX_AVATAR_SIZE = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    private final ISiteSettingService siteSettingService;

    public AdminSiteController(ISiteSettingService siteSettingService) {
        this.siteSettingService = siteSettingService;
    }

    @GetMapping("/profile")
    public Result<SiteProfileVo> getProfile() {
        return Result.success(siteSettingService.getSiteProfile());
    }

    @PutMapping("/profile")
    public Result<Void> updateProfile(@Valid @RequestBody SiteProfileReq profileReq) {
        siteSettingService.updateSiteProfile(profileReq);
        return Result.success();
    }

    @PostMapping("/profile/avatar")
    public Result<AvatarUploadVo> uploadAvatar(@RequestParam("file") MultipartFile file) {
        validateAvatar(file);
        String extension = getExtension(file);
        String fileName = UUID.randomUUID() + "." + extension;
        Path avatarDir = Path.of(System.getProperty("user.dir"), "uploads", "avatar").toAbsolutePath().normalize();
        Path targetPath = avatarDir.resolve(fileName).normalize();

        try {
            Files.createDirectories(avatarDir);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException exception) {
            throw new BizException(ErrorCode.INTERNAL_ERROR, "头像保存失败");
        }

        AvatarUploadVo vo = new AvatarUploadVo();
        vo.setAvatarUrl("/uploads/avatar/" + fileName);
        return Result.success(vo);
    }

    private void validateAvatar(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BizException(ErrorCode.BAD_REQUEST, "请选择头像文件");
        }

        if (file.getSize() > MAX_AVATAR_SIZE) {
            throw new BizException(ErrorCode.BAD_REQUEST, "头像不能超过 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new BizException(ErrorCode.BAD_REQUEST, "头像仅支持 JPG、PNG 或 WebP 格式");
        }
    }

    private String getExtension(MultipartFile file) {
        String contentType = file.getContentType();
        if ("image/png".equalsIgnoreCase(contentType)) {
            return "png";
        }
        if ("image/webp".equalsIgnoreCase(contentType)) {
            return "webp";
        }
        return "jpg";
    }
}
