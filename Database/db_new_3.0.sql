-- USERS
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    national_id VARCHAR(20) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL,
    email VARCHAR(50) NOT NULL,
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_national_id UNIQUE (national_id)
);

CREATE INDEX ix_users_user_id ON users (user_id);
CREATE INDEX ix_users_username ON users (username);
CREATE INDEX ix_users_phone ON users (phone);
CREATE INDEX ix_users_email ON users (email);

-- STALL
CREATE TABLE stall (
    stall_id SERIAL PRIMARY KEY,
    stall_name VARCHAR(100) NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    stall_bg_img VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- STOCK
CREATE TABLE stock (
    stock_id SERIAL PRIMARY KEY,
    stall_id INTEGER NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    stock_img_path VARCHAR(500),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stall_id) REFERENCES stall(stall_id) ON DELETE CASCADE
);

-- ORDER STATUSES
CREATE TABLE order_statuses (
    order_status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO order_statuses (status_name) VALUES 
('Pending'),
('Confirmed'),
('Cancelled'),
('Shipped'),
('Delivered');

-- ORDERS
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_status_id INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (order_status_id) REFERENCES order_statuses(order_status_id)
);

CREATE INDEX ix_orders_user_id ON orders (user_id);

-- ORDER ITEMS
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    stock_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_order NUMERIC(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stock(stock_id) ON DELETE CASCADE
);

CREATE INDEX ix_order_items_order_id ON order_items(order_id);
CREATE INDEX ix_order_items_stock_id ON order_items(stock_id);

-- PAYMENT METHODS
CREATE TABLE payment_methods (
    payment_method_id SERIAL PRIMARY KEY,
    method_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO payment_methods (method_name) VALUES 
('Credit Card'),
('Debit Card'),
('PayPal'),
('Cash on Delivery'),
('Bank Transfer');

-- PAYMENT STATUSES
CREATE TABLE payment_statuses (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO payment_statuses (status_name) VALUES 
('Pending'),
('Completed'),
('Failed'),
('Refunded');

-- PAYMENT
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    payment_method_id INTEGER NOT NULL,
    payment_amount NUMERIC(10, 2) NOT NULL,
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status_id INTEGER DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_status_id) REFERENCES payment_statuses(status_id)
);

CREATE INDEX ix_payment_order_id ON payment(order_id);
CREATE INDEX ix_payment_method_id ON payment(payment_method_id);
CREATE INDEX ix_payment_status_id ON payment(payment_status_id);

-- TRIGGER TO AUTO UPDATE updated_time
CREATE OR REPLACE FUNCTION update_payment_updated_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_time = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_payment_updated_time
BEFORE UPDATE ON payment
FOR EACH ROW
EXECUTE FUNCTION update_payment_updated_time();
