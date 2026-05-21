package com.liubaicode.model.vo.archive;

import java.util.List;
import lombok.Data;

@Data
public class ArchiveYearGroupVo {

    private Integer year;

    private List<ArchiveMonthGroupVo> months;
}
