package com.liubaicode.common.result;

import java.time.Instant;

public record Result<T>(
        Integer code,
        String message,
        T data,
        Long timestamp
) {

    public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data, Instant.now().toEpochMilli());
    }

    public static <T> Result<T> success() {
        return success(null);
    }
}
