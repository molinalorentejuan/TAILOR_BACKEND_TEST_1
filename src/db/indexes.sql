-- Índices para mejorar rendimiento en consultas

-- USERS
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- RESTAURANTS
CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating);
CREATE INDEX IF NOT EXISTS idx_restaurants_name ON restaurants(name);

-- REVIEWS
CREATE INDEX IF NOT EXISTS idx_reviews_restaurantId ON reviews(restaurantId);
CREATE INDEX IF NOT EXISTS idx_reviews_userId ON reviews(userId);

-- FAVORITES
CREATE INDEX IF NOT EXISTS idx_favorites_userId ON favorites(userId);
CREATE INDEX IF NOT EXISTS idx_favorites_restaurantId ON favorites(restaurantId);