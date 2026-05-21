package com.liubaicode.common.result;

import com.liubaicode.common.exception.ErrorCode;
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

    public static <T> Result<T> failure(ErrorCode errorCode) {
        return failure(errorCode.getCode(), errorCode.getMessage());
    }

    public static <T> Result<T> failure(ErrorCode errorCode, String message) {
        return failure(errorCode.getCode(), message);
    }

    public static <T> Result<T> failure(Integer code, String message) {
        return new Result<>(code, message, null, Instant.now().toEpochMilli());
    }
}
