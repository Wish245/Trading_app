-- USERS
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    national_id VARCHAR(20) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL,
    email VARCHAR(50) NOT NULL
);

CREATE INDEX ix_users_user_id ON users (user_id);
CREATE INDEX ix_users_username ON users (username);
CREATE INDEX ix_users_phone ON users (phone);
CREATE INDEX ix_users_email ON users (email);

-- ITEM CATEGORIES
CREATE TABLE item_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- ITEMS
CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    item_img_path TEXT,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES item_categories(category_id) ON DELETE SET NULL
);

-- STALLS
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

-- STOCK IMAGES
CREATE TABLE stock_images (
    image_id SERIAL PRIMARY KEY,
    stock_id INTEGER NOT NULL,
    image_path TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_id) REFERENCES stock(stock_id) ON DELETE CASCADE
);

-- ORDERS
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

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

-- PAYMENT METHODS
CREATE TABLE payment_methods (
    payment_method_id SERIAL PRIMARY KEY,
    method_name VARCHAR(50) NOT NULL
);

-- PAYMENT STATUSES
CREATE TABLE payment_statuses (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE
);

-- PAYMENTS
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    payment_method_id INTEGER NOT NULL,
    payment_amount NUMERIC(10, 2) NOT NULL,
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status_id INTEGER DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_status_id) REFERENCES payment_statuses(status_id)
);
