const express = require("express");
const bodyParser = require("body-parser");
const { initializeDatabase } = require("./db/sql");

const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const tagRoutes = require("./routes/tags");
const likeRoutes = require("./routes/likes");

const app = express();
app.use(bodyParser.json());

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-username"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/tags", tagRoutes);
app.use("/likes", likeRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Infinite Thread!");
});

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    // Initialize the database
    await initializeDatabase();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Error initializing the database or starting the server",
      error
    );
  }
};

startServer();

module.exports = app;
