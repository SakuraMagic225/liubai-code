package com.liubaicode.service;

import com.liubaicode.model.dto.site.SiteProfileReq;
import com.liubaicode.model.vo.site.SiteProfileVo;

public interface ISiteSettingService {

    SiteProfileVo getSiteProfile();

    void updateSiteProfile(SiteProfileReq profileReq);
}
