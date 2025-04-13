-- USERS
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    national_id VARCHAR(20) UNIQUE
);

-- USER CONTACTS
CREATE TABLE user_contacts (
    contact_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    contact_type VARCHAR(50) NOT NULL, -- e.g., 'email', 'phone'
    contact_value TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ROLES
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- USER_ROLES
CREATE TABLE user_roles (
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

-- FLOWER CATEGORIES
CREATE TABLE flower_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- FLOWERS
CREATE TABLE flowers (
    flower_id SERIAL PRIMARY KEY,
    flower_name VARCHAR(100) NOT NULL,
    flower_img_path TEXT,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES flower_categories(category_id) ON DELETE SET NULL
);

-- FLOWER TRANSLATIONS
CREATE TABLE flower_translations (
    flower_translation_id SERIAL PRIMARY KEY,
    flower_id INTEGER NOT NULL,
    language_code CHAR(2) NOT NULL,
    translated_name VARCHAR(100),
    FOREIGN KEY (flower_id) REFERENCES flowers(flower_id) ON DELETE CASCADE
);

-- STALLS
CREATE TABLE stall (
    stall_id SERIAL PRIMARY KEY,
    stall_name VARCHAR(100) NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- STOCK
CREATE TABLE stock (
    stock_id SERIAL PRIMARY KEY,
    stall_id INTEGER NOT NULL,
    flower_id INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stall_id) REFERENCES stall(stall_id) ON DELETE CASCADE,
    FOREIGN KEY (flower_id) REFERENCES flowers(flower_id) ON DELETE CASCADE
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
    price_at_order NUMERIC(10,2) NOT NULL,
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
