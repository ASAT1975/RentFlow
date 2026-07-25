package com.rentflow.rentflow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntime(RuntimeException ex) {
        String message = ex.getMessage();
        if (message == null) message = "An unexpected error occurred";

        int status = 500;
        if (message.contains("not found") || message.contains("No unit found")) status = 404;
        else if (message.contains("already occupied") || message.contains("already exists")) status = 409;
        else if (message.contains("Missing or invalid Authorization")) status = 401;
        else if (message.contains("Only landlords") || message.contains("Only tenants") || message.contains("do not own")) status = 403;
        else if (message.contains("Invalid invite code") || message.contains("Invalid role")) status = 400;

        return ResponseEntity.status(status).body(Map.of("error", message));
    }
}
