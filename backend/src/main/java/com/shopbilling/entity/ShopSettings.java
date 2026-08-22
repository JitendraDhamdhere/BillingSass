package com.shopbilling.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shop_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String shopName;

    private String ownerName;
    private String gstNumber;
    private String panNumber;
    private String registrationNumber;
    private String businessType;

    private String mobile;
    private String email;

    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String country;
    private String pincode;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String shopLogo;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profileImage;

    private String upiId;
    private String upiMerchantName;
    private String bankName;
    private String accountHolderName;
    private String accountNumber;
    private String ifscCode;

    private String invoicePrefix;
    private String receiptPrefix;
    private String footerMessage;

    @Column(columnDefinition = "TEXT")
    private String termsConditions;
    private String thankYouMessage;

    @Builder.Default
    private Boolean showLogo = true;
    @Builder.Default
    private Boolean showQr = true;
    @Builder.Default
    private Boolean showGst = true;
    @Builder.Default
    private Boolean showAddress = true;
    @Builder.Default
    private Boolean showMobile = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
