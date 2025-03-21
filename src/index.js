// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error :", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running on port :${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongoose db connection failed", error);
  });
