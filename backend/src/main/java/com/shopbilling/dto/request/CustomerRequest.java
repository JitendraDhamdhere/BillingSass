package com.shopbilling.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class CustomerRequest {
    private String customerCode;
    @NotBlank(message = "name is required")
    private String name;
    private String mobile;
    private String email;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String gstNumber;
    private String status;
}
