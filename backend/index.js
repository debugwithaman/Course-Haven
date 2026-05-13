import express  from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import courseRoute from "./routes/course.routes.js"
import fileUpload from "express-fileupload"
import { v2 as cloudinary } from 'cloudinary';
import userRoute from "./routes/user.route.js"


const app = express()
dotenv.config();

// middleware:
app.use(express.json());

// File Upload : It is taekn from file upload in express js docs
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

const port = process.env.PORT || 3000;
const DB_URL = process.env.MONGO_URL;

try {
 await mongoose.connect(DB_URL);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
}

// Defining routes: Here v1 means version 1 after any update we make it v2,v3...
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/user",userRoute);

// Cloudinary Code , Taken from its docs
 cloudinary.config({ 
        cloud_name: process.env.cloud_name, 
        api_key: process.env.api_key, 
        api_secret: process.env.api_secret
    });

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
