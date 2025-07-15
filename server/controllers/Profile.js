const Course = require("../models/Course");
const Profile = require("../models/Profile")
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const {convertSecondsToDuration} = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress")


exports.updateProfile = async(req,res)=>{
   try{
     // get data from req body
     const {dateofBirth="",about="",contactNumber,gender}=req.body;

     /// get userid
     const id = req.user.id;
     // validation (consider adjusting this based on required fields)
     if(!contactNumber || !gender || !id){
      // You might want a different status code like 400 Bad Request
      return res.status(400).json({
        success:false,
        message:"Contact Number and Gender are required fields."
      });
     }

     // find profile
     const userDetails = await User.findById(id) ;
     const profileId = userDetails.additionalDetails;
     //now we have profileId so extrat all data of profile by help of profileId
     const profileDetails = await Profile.findById(profileId);

     // update profile  details
     profileDetails.dateofBirth= dateofBirth;
     profileDetails.gender= gender;
     profileDetails.about= about;
     profileDetails.contactNumber= contactNumber;

     await profileDetails.save();

     // Find the updated User details and populate the profile
     const updatedUserDetails = await User.findById(id)
                                        .populate("additionalDetails")
                                        .exec();


     //return response

     return res.status(200).json({
      success:true,
      message:"Profile Updated Successfully",
      updatedUserDetails, // Return the updated user details
     })

   }
   catch(error){
     // Log the actual error for debugging
     console.error("Error while updating Profile:", error);
     // Return a 500 Internal Server Error for unexpected errors
     return res.status(500).json({
      success:false,
      message:"Could Not Update Profile. Please try again.",
      error: error.message, // Include error message for debugging
     })
   }
}


  
// delete Account or profile+user both details  

exports.deleteAccount = async(req,res)=>{
  try{
    //(1)delete profile 
     // get id
     const {id}= req.user.id;
     // validation 
     const userDetails= await User.findById(id);
     if(!userDetails){
      return res.status(404).json({
        success:false,
        message:"Fields are required",
      })
     }
     //delete profile 
     // find profileid first 
     const profileId = userDetails.additionalDetails;
     await Profile.findByIdAndDelete({_id:profileId})
     //update courses assosiated with profile as empty 
     for (const courseId of userDetails.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnroled: id} },
        { new: true }
      )
    }
     //(2)delete user
     await User.findByIdAndDelete({_id:id})
     await CourseProgress.deleteMany({ userId: id })

     // return response
     return res.status(200).json({
       success:true,
       message:"Account Deleted SUccessfully"
     })

  }
  catch(error){
      return res.status()
  }
}



// get all user details 

exports.getAllUserDetails = async (req, res) => {
  try {
    // Get user ID from request
    const id = req.user.id;

    // Fetch user details with population
    const userDetails = await User.findById(id).populate("additionalDetails").exec();

    // Check if user exists
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return user details
    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching data",
      error: error.message,
    });
  }
};


// get updated display pictures 
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Image not updated",
    })
  }
}

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    let userDetails = await User.findOne({ _id: userId })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    userDetails = userDetails.toObject();

    for (let i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      let SubsectionLength = 0;

      const courseContentArr = userDetails.courses[i].courseContent || [];
      for (let j = 0; j < courseContentArr.length; j++) {
        const subSections = courseContentArr[j].subSection || [];
        totalDurationInSeconds += subSections.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration || 0),
          0
        );
        SubsectionLength += subSections.length;
      }

      userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);

      let courseProgress = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });

      const completedCount = courseProgress?.completedVideos?.length || 0;

      userDetails.courses[i].progressPercentage = SubsectionLength === 0
        ? 100
        : Math.round((completedCount / SubsectionLength) * 10000) / 100;
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    console.error("Error yha hai dosto ", error); // ✅ better logging
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching enrolled courses",
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnroled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
