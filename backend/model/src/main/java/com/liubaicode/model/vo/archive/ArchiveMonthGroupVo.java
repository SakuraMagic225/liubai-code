package com.liubaicode.model.vo.archive;

import com.liubaicode.model.vo.article.ArticlePublicSummaryVo;
import java.util.List;
import lombok.Data;

@Data
public class ArchiveMonthGroupVo {

    private Integer month;

    private List<ArticlePublicSummaryVo> articles;
}
