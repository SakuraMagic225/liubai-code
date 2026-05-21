package com.liubaicode.repository.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.liubaicode.model.entity.ArticleTag;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Param;

public interface ArticleTagMapper extends BaseMapper<ArticleTag> {

    @Delete("""
            DELETE FROM article_tag
            WHERE article_id = #{articleId}
              AND tag_id = #{tagId}
              AND is_deleted = 1
            """)
    int deleteDeletedRelation(@Param("articleId") Long articleId, @Param("tagId") Long tagId);
}
