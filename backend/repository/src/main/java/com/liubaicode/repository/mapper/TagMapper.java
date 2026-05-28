package com.liubaicode.repository.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.liubaicode.model.entity.Tag;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Param;

public interface TagMapper extends BaseMapper<Tag> {

    @Delete("""
            DELETE FROM tag
            WHERE name = #{name}
              AND is_deleted = 1
            """)
    int deleteDeletedTagByName(@Param("name") String name);
}
