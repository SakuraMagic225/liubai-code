package com.liubaicode.model.vo.archive;

import java.util.List;
import lombok.Data;

@Data
public class ArchiveVo {

    private List<ArchiveYearGroupVo> groups;

    private ArchiveStatsVo stats;
}
