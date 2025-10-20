-- Create order_items table if missing
-- Create order_items table if missing
CREATE TABLE
IF NOT EXISTS order_items
(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER,
  variant_id INTEGER,
  quantity INTEGER DEFAULT 1,
  price REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY
(order_id) REFERENCES orders
(id) ON
DELETE CASCADE,
  FOREIGN KEY (product_id)
REFERENCES products
(id)
);
