-- FloodSense - Simple PostgreSQL Schema
-- Beginner friendly, normalized design

-- USERS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

-- DISTRICTS
CREATE TABLE districts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL
);

-- ALERTS
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  severity TEXT NOT NULL,
  district_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (district_id)
    REFERENCES districts(id)
    ON DELETE CASCADE
);
