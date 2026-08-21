CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    mobile VARCHAR(50),
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Admin user (password: admin123)
INSERT INTO users (username, password, full_name, status, created_at, updated_at) 
VALUES ('admin', '$2a$10$.DsqEvrmCYCPuCOFnHRXDexdNsnw.FZe8dOAkzn2WhsrhlZxGVao.', 'System Admin', 'ACTIVE', NOW(), NOW());

INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'admin' AND r.name = 'ADMIN';

-- Manager user (password: manager123)
INSERT INTO users (username, password, full_name, status, created_at, updated_at) 
VALUES ('manager', '$2a$10$U7v001vH5a7R8n1e4Zp96.3c8y0u0Z1C7x8l0Y4b1w8C6v5B7F9zS', 'Shop Manager', 'ACTIVE', NOW(), NOW());

INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'manager' AND r.name = 'MANAGER';

-- Cashier user (password: cashier123)
INSERT INTO users (username, password, full_name, status, created_at, updated_at) 
VALUES ('cashier', '$2a$10$V8w112wI6b8S9o2f5Aq07.4d9z1v1A2D8y9m1Z5c2x9D7w6C8G0aT', 'Front Cashier', 'ACTIVE', NOW(), NOW());

INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'cashier' AND r.name = 'CASHIER';
