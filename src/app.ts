import express from "express"; // Import Express module
import userRoute from "./routes/user.js"; // Assuming user.js is in a subfolder named routes
import NodeCache from "node-cache" 

const app = express(); // Create an Express application instance

  
export const myCache = new NodeCache

app.get("/", (req, res) => { // Route handler for the root path ("/")
  res.send("API is working with api/v1"); // Send a response message
});

 
app.use("/api/v1/user", userRoute); // Mount the user routes at the specified path
 

export {app}