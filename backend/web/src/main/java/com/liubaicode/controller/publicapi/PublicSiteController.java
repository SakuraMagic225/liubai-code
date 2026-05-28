package com.liubaicode.controller.publicapi;

import com.liubaicode.common.constant.AppConstants;
import com.liubaicode.common.result.Result;
import com.liubaicode.model.vo.site.SiteProfileVo;
import com.liubaicode.service.ISiteSettingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConstants.API_PREFIX + "/site")
public class PublicSiteController {

    private final ISiteSettingService siteSettingService;

    public PublicSiteController(ISiteSettingService siteSettingService) {
        this.siteSettingService = siteSettingService;
    }

    @GetMapping("/profile")
    public Result<SiteProfileVo> getProfile() {
        return Result.success(siteSettingService.getSiteProfile());
    }
}
