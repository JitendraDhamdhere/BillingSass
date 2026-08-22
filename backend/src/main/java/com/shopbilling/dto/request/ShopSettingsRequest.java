package com.shopbilling.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ShopSettingsRequest {
    // Admin profile fields
    @NotBlank(message = "Admin name is required")
    private String adminName;
    @NotBlank(message = "Admin mobile number is required")
    private String adminMobile;
    @NotBlank(message = "Admin email address is required")
    private String adminEmail;
    @NotBlank(message = "Admin username is required")
    private String adminUsername;

    // Shop info fields
    @NotBlank(message = "Shop name is required")
    private String shopName;
    private String ownerName;
    private String gstNumber;
    private String panNumber;
    private String registrationNumber;
    private String businessType;

    // Address
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String country;
    private String pincode;

    // Payment Info
    private String upiId;
    private String upiMerchantName;
    private String bankName;
    private String accountHolderName;
    private String accountNumber;
    private String ifscCode;

    // Invoices settings
    private String invoicePrefix;
    private String receiptPrefix;
    private String footerMessage;
    private String termsConditions;
    private String thankYouMessage;

    // Visibility settings
    private Boolean showLogo;
    private Boolean showQr;
    private Boolean showGst;
    private Boolean showAddress;
    private Boolean showMobile;
}
