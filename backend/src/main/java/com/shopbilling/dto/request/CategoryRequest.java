package com.shopbilling.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class CategoryRequest {
    @NotBlank(message = "name is required")
    private String name;
    private String description;
    private String status;
}
