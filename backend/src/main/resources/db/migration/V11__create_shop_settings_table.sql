CREATE TABLE shop_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shop_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255),
    gst_number VARCHAR(50),
    pan_number VARCHAR(50),
    registration_number VARCHAR(100),
    business_type VARCHAR(100),
    
    mobile VARCHAR(50),
    email VARCHAR(100),
    
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(20),
    
    shop_logo LONGTEXT,
    profile_image LONGTEXT,
    
    upi_id VARCHAR(100),
    upi_merchant_name VARCHAR(100),
    bank_name VARCHAR(100),
    account_holder_name VARCHAR(100),
    account_number VARCHAR(100),
    ifsc_code VARCHAR(50),
    
    invoice_prefix VARCHAR(50),
    receipt_prefix VARCHAR(50),
    footer_message VARCHAR(255),
    terms_conditions TEXT,
    thank_you_message VARCHAR(255),
    
    show_logo BOOLEAN DEFAULT TRUE,
    show_qr BOOLEAN DEFAULT TRUE,
    show_gst BOOLEAN DEFAULT TRUE,
    show_address BOOLEAN DEFAULT TRUE,
    show_mobile BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed a default settings row on migration
INSERT INTO shop_settings (id, shop_name, owner_name, invoice_prefix, receipt_prefix, show_logo, show_qr, show_gst, show_address, show_mobile)
VALUES (1, 'ShopBilling', 'Administrator', 'INV-', 'REC-', true, true, true, true, true);
