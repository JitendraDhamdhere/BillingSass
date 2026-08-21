CREATE TABLE inventory_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    previous_quantity INT NOT NULL,
    transaction_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    reference_number VARCHAR(255),
    reason TEXT,
    username VARCHAR(255),
    transaction_date DATETIME NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
