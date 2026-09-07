package com.snapgallery.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ApiException extends RuntimeException {
    private final HttpStatus status;
    private final String code;

    public ApiException(String message, HttpStatus status, String code) {
        super(message);
        this.status = status;
        this.code = code;
    }

    public static ApiException badRequest(String message, String code) {
        return new ApiException(message, HttpStatus.BAD_REQUEST, code);
    }

    public static ApiException unauthorized(String message, String code) {
        return new ApiException(message, HttpStatus.UNAUTHORIZED, code);
    }

    public static ApiException forbidden(String message, String code) {
        return new ApiException(message, HttpStatus.FORBIDDEN, code);
    }

    public static ApiException notFound(String message, String code) {
        return new ApiException(message, HttpStatus.NOT_FOUND, code);
    }

    public static ApiException conflict(String message, String code) {
        return new ApiException(message, HttpStatus.CONFLICT, code);
    }
}
