package com.shopbilling.dto.response;

import lombok.Data;

@Data
public class ShopSettingsResponse {
    private Long id;

    // Admin profile fields
    private String adminName;
    private String adminMobile;
    private String adminEmail;
    private String adminUsername;
    private String profileImage;

    // Shop info fields
    private String shopName;
    private String ownerName;
    private String gstNumber;
    private String panNumber;
    private String registrationNumber;
    private String businessType;
    private String shopLogo;

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
