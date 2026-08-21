CREATE TABLE sales_returns (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    return_number VARCHAR(255) NOT NULL UNIQUE,
    sale_id BIGINT NOT NULL,
    return_date DATETIME NOT NULL,
    refund_amount DECIMAL(15,2) NOT NULL,
    reason TEXT,
    user VARCHAR(255),
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE RESTRICT
);

CREATE TABLE sales_return_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sales_return_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    refund_amount DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (sales_return_id) REFERENCES sales_returns(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);
