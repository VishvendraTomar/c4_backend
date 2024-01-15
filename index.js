// Import required modules
const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.route");
// const { auth } = require("./middlewares/auth.middleware");



const { postRouter } = require("./routes/post.route");
const { auth } = require("./middlewares/Auth.middleware");

require("dotenv").config();

// Create an Express application
const app = express();

// Middleware to parse JSON in requests
app.use(express.json());

// Middleware to handle Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Route for handling user-related endpoints
app.get("/" , (req,res)=>{
    res.send("welsome to home page")
})
app.use("/users", userRouter);
app.use("/posts", auth , postRouter);

app.listen(8080, async () => {
  try {
    // Connect to the database
    await connection;
    console.log("Db connected");
    
    // Start the server
    console.log("Server running at port 8080");
  } catch (error) {
    console.log(error.message);
  }
});
