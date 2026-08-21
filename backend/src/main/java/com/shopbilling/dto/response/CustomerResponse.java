package com.shopbilling.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CustomerResponse {
    private Long id;
    private String customerCode;
    private String name;
    private String mobile;
    private String email;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String gstNumber;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
