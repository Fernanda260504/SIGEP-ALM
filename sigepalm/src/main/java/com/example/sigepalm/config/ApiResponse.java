package com.example.sigepalm.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T>{
    private boolean success;
    private String message;
    private T data;
    private HttpStatus status;
    private LocalDateTime timestamp;

    // Respuesta exitosa con datos
    public static <T> ApiResponse<T> success(String message, T data, HttpStatus status) {
        return new ApiResponse<>(
                true,
                message,
                data,
                status,
                LocalDateTime.now()
        );
    }

    // Respuesta exitosa sin datos
    public static <T> ApiResponse<T> success(String message, HttpStatus status) {
        return new ApiResponse<>(
                true,
                message,
                null,
                status,
                LocalDateTime.now()
        );
    }

    // Respuesta de error
    public static <T> ApiResponse<T> error(String message, HttpStatus status) {
        return new ApiResponse<>(
                false,
                message,
                null,
                status,
                LocalDateTime.now()
        );
    }

}
