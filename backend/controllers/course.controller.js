import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createCourse = async (req, res) => {

// console.log("Course Created..")
// const title = req.body.title;
// const description = req.body.description;
// const price = req.body.price;
// const image = req.body.image;

// Instead of writing upper code we can write in this downward format

  const { title, description, price } = req.body;

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Check file first
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No File Uploaded..." });
    }

    const { image } = req.files; // ✅ declare BEFORE use

    const allowedFormat = ["image/png", "image/jpeg"];

    if (!allowedFormat.includes(image.mimetype)) { // ✅ correct spelling
      return res.status(400).json({
        error: "Invalid file format. Only PNG and JPG are allowed"
      });
    }

    // ✅ Upload to Cloudinary
    const cloud_response = await cloudinary.uploader.upload(
      image.tempFilePath
    );

    if (!cloud_response || cloud_response.error) {
      return res.status(400).json({
        error: "Error uploading file to cloudinary..."
      });
    }

    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.secure_url,
      },
    };

    const course = await Course.create(courseData);

    res.json({
      message: "Course Created Successfully",
      course,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server creating course.." });
  }
};

export const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const { title, description, price, image } = req.body;

  try {
    const course = await Course.updateOne({
      _id: courseId
    },{
      title,
      description,
      price,
      image:{
        public_id:image?.public_id,
        url:image?.url,
      }
    })
    res.json({
      message:"Course Updated Successfully",
      course,
    })
  } catch (error) {
    res.status(500).json({ error: "Server error while updating course.." });
    console.log("Error in course updating",error)
  }
}

export const deleteCourse = async (req, res) => {
  const {courseId} = req.params;
  
  try {
    const course = await Course.findOneAndDelete({
      _id:courseId,
    })
    if(!course){
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({
      message:"Course Deleted Successfully",
      course,
    })
  } catch (error) {
    res.status(500).json({ error: "Server error while deleting course.." });
    
    console.log("Error in course deleting..",error);
  }
}

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json({
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
     console.log("Error in get courses..",error);
     res.status(500).json({ error: "Server error while fetching courses.." });
  }
}

export const courseDetails = async (req, res) => {
   const { courseId } = req.params;

   try {
    const course = await Course.findById(courseId);

    if(!course){
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({
      message:"Course details fetched successfully",
      course,
    })
   } catch (error) {
    console.log("Error in course details..",error)
    res.status(500).json({ error: "Server error while fetching course details.." });
   }
}
