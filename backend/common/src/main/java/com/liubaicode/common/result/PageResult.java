package com.liubaicode.common.result;

import java.util.List;

public record PageResult<T>(
        List<T> records,
        Long total,
        Integer page,
        Integer pageSize,
        Integer totalPages
) {
}
