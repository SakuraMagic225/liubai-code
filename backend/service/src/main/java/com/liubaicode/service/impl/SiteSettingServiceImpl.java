package com.liubaicode.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.liubaicode.model.dto.site.SiteProfileReq;
import com.liubaicode.model.entity.SiteSetting;
import com.liubaicode.model.vo.site.SiteProfileVo;
import com.liubaicode.repository.mapper.SiteSettingMapper;
import com.liubaicode.service.ISiteSettingService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SiteSettingServiceImpl implements ISiteSettingService {

    private static final int NOT_DELETED = 0;
    private static final String NAME = "profile.name";
    private static final String TITLE = "profile.title";
    private static final String BIO = "profile.bio";
    private static final String AVATAR_URL = "profile.avatarUrl";
    private static final String GITHUB_URL = "profile.githubUrl";
    private static final String EMAIL = "profile.email";
    private static final String RSS_URL = "profile.rssUrl";

    private final SiteSettingMapper siteSettingMapper;

    public SiteSettingServiceImpl(SiteSettingMapper siteSettingMapper) {
        this.siteSettingMapper = siteSettingMapper;
    }

    @Override
    public SiteProfileVo getSiteProfile() {
        List<SiteSetting> settings = siteSettingMapper.selectList(new LambdaQueryWrapper<SiteSetting>()
                .eq(SiteSetting::getIsDeleted, NOT_DELETED));
        Map<String, String> settingMap = new HashMap<>();
        for (SiteSetting setting : settings) {
            settingMap.put(setting.getSettingKey(), setting.getSettingValue());
        }

        SiteProfileVo profile = new SiteProfileVo();
        profile.setName(valueOrDefault(settingMap.get(NAME), "留白"));
        profile.setTitle(valueOrDefault(settingMap.get(TITLE), "Java 后端开发 / AI Agent 实践者"));
        profile.setBio(valueOrDefault(settingMap.get(BIO), "记录后端工程、系统设计与 AI 协作编码。偏爱清晰边界、稳定交付和能留下思考空间的代码。"));
        profile.setAvatarUrl(valueOrDefault(settingMap.get(AVATAR_URL), ""));
        profile.setGithubUrl(valueOrDefault(settingMap.get(GITHUB_URL), "https://github.com/"));
        profile.setEmail(valueOrDefault(settingMap.get(EMAIL), "hello@liubaicode.dev"));
        profile.setRssUrl(valueOrDefault(settingMap.get(RSS_URL), "/rss.xml"));
        return profile;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateSiteProfile(SiteProfileReq profileReq) {
        upsert(NAME, profileReq.getName(), "个人昵称");
        upsert(TITLE, profileReq.getTitle(), "身份标题");
        upsert(BIO, profileReq.getBio(), "个人简介");
        upsert(AVATAR_URL, profileReq.getAvatarUrl(), "头像地址");
        upsert(GITHUB_URL, profileReq.getGithubUrl(), "GitHub 地址");
        upsert(EMAIL, profileReq.getEmail(), "邮箱");
        upsert(RSS_URL, profileReq.getRssUrl(), "RSS 地址");
    }

    private void upsert(String key, String value, String description) {
        String normalizedValue = value == null ? "" : value.trim();
        SiteSetting existingSetting = siteSettingMapper.selectOne(new LambdaQueryWrapper<SiteSetting>()
                .eq(SiteSetting::getSettingKey, key)
                .eq(SiteSetting::getIsDeleted, NOT_DELETED));

        if (existingSetting == null) {
            SiteSetting setting = new SiteSetting();
            setting.setSettingKey(key);
            setting.setSettingValue(normalizedValue);
            setting.setDescription(description);
            setting.setIsDeleted(NOT_DELETED);
            siteSettingMapper.insert(setting);
            return;
        }

        siteSettingMapper.update(null, new LambdaUpdateWrapper<SiteSetting>()
                .eq(SiteSetting::getId, existingSetting.getId())
                .set(SiteSetting::getSettingValue, normalizedValue)
                .set(SiteSetting::getDescription, description));
    }

    private String valueOrDefault(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value;
    }
}
