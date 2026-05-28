package com.liubaicode.service;

import com.liubaicode.model.dto.tag.TagCreateReq;
import com.liubaicode.model.dto.tag.TagUpdateReq;
import com.liubaicode.model.vo.tag.TagAdminVo;
import java.util.List;

public interface ITagService {

    List<TagAdminVo> listAdminTags(String keyword);

    TagAdminVo getAdminTagDetail(Long id);

    Long createTag(TagCreateReq createReq);

    void updateTag(Long id, TagUpdateReq updateReq);

    void deleteTag(Long id);
}
