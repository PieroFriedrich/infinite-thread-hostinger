require("dotenv").config();

const mysql = require("mysql2/promise");

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  queueLimit: 0,
});

// Initialize database function
const initializeDatabase = async () => {
  const database = process.env.DB_DATABASE;

  try {
    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ${database}.users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255)
      )
    `);

    // Create posts table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ${database}.posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        details TEXT NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author) REFERENCES ${database}.users(email)
      )
    `);

    // Create tags table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ${database}.tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      )
    `);

    // Create post_tags join table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ${database}.post_tags (
        post_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES ${database}.posts(id),
        FOREIGN KEY (tag_id) REFERENCES ${database}.tags(id)
      )
    `);

    // Create likes table
    await pool.execute(`
    CREATE TABLE IF NOT EXISTS likes (
      id INT AUTO_INCREMENT PRIMARY KEY,  -- Add an auto-increment primary key
      user_email VARCHAR(255) NOT NULL,
      post_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_email) REFERENCES users(email),
      FOREIGN KEY (post_id) REFERENCES posts(id)
      )
    `);

    // Add this to the existing initializeDatabase function
    await pool.execute(`
    CREATE TABLE IF NOT EXISTS ${database}.comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      author VARCHAR(255) NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES ${database}.posts(id),
      FOREIGN KEY (author) REFERENCES ${database}.users(email)
      )
    `);

    // Insert predefined tags
    const predefinedTags = [
      "JavaScript",
      "React",
      "Node.js",
      "Database",
      "Web Development",
      "Java",
      "PHP",
      "C++",
      "C",
      "Next.js",
      "Go",
      "HTML",
      "CSS",
      "Tailwind.css",
      "Express.js",
      "Laravel",
      "Bootstrap",
      "Dart",
      "Swift",
      "SASS",
      "SCSS",
      "OOP",
      "Data Structures",
      "Angular",
      "Vue",
      "Mongo DB",
      "SQL",
      "Bash",
      "Spring",
      "Redis",
      "AWS",
      "Django",
      "Python",
      "Machine Learning",
      "AI",
      "Docker",
      "React Native",
      "C#",
    ];

    for (const tag of predefinedTags) {
      await pool.execute(
        `INSERT IGNORE INTO ${database}.tags (name) VALUES (?)`,
        [tag]
      );
    }

    console.log("Database tables initialized and predefined tags inserted");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};

module.exports = {
  pool,
  initializeDatabase,
};
