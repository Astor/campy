use camp_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  opt_out TINYINT(1) NOT NULL DEFAULT 0,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activities (
  activity_id INT AUTO_INCREMENT PRIMARY KEY,
  activity_name VARCHAR(255) NOT NULL
);

CREATE TABLE user_activities (
  user_activity_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  activity_id INT NOT NULL,
  activity_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (activity_id) REFERENCES activities(activity_id)
);

INSERT INTO activities (activity_name) VALUES ('door'), ('phone'), ('events');