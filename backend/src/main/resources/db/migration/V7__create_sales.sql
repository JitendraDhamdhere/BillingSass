CREATE TABLE sales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sale_number VARCHAR(255) NOT NULL UNIQUE,
    customer_id BIGINT,
    sale_date DATETIME NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    discount DECIMAL(15,2) NOT NULL,
    tax DECIMAL(15,2) NOT NULL,
    grand_total DECIMAL(15,2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    notes TEXT,
    cashier VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

CREATE TABLE sale_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sale_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    selling_price DECIMAL(15,2) NOT NULL,
    purchase_price_at_sale DECIMAL(15,2) NOT NULL,
    discount DECIMAL(15,2) NOT NULL,
    tax DECIMAL(15,2) NOT NULL,
    total DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);
