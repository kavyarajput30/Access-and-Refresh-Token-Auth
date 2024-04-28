import dotenv from "dotenv";
import app from './app.js';
import connectDB from "./db/index.js"
dotenv.config();

const port = process.env.PORT || 8080;

connectDB().then(
    app.listen(port , () => {
        console.log(`Server is running on port ${port}`)
    })
).catch(err => console.log("MONGODB CONNECTION ERROR",err))