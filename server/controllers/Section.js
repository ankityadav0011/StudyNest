const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/Subsection");

// CREATE a new section
exports.createSection = async (req, res) => {
  try {
    // Extract the required properties from the request body
    const { sectionName, courseId } = req.body;

    // Validate the input
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      });
    }

    // Create a new section with the given name
    const newSection = await Section.create({ sectionName });

    // Add the new section to the course's content array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Return the updated course object in the response
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//update  section
exports.updateSection = async (req, res) => {
  try {
    // data input
    const { sectionName, sectionId } = req.body;

    //data validation
    if (!sectionName || !sectionId) {
      return res.status(404).json({
        success: false,
        message: "All fiels are required or Properties are missing",
      });
    }
    //update data
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    // populate it to get updated data
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    console.log(course);
    res.status(200).json({
      success: true,
      message: section,
      data: course,
    });
    // return res
    return res.status(200).json({
      success:true,
      message:"Section Updated Successfully"
    })
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Unable to update section,please try again later",
    });
  }
};

//delete section 
exports.deleteSection = async (req,res)=>{
  try{
      // extract the id from re body 
   const {sectionId}= req.body;
   // check for section id exist or not 
   if(!sectionId){
    return res.status(404).json({
      success:false,
      message:"SectionId not exist"
    })
   }
   // apply findbyidanddelete
    await Section.findByIdAndDelete(sectionId);
      // return response 
    return res.status(200).json({
       success:true,
       message:"Section deleted Successfully"
    })
  }
  catch(error){
      return res.status(404).json({
        success:false,
        message:"Unable to delete the Section"
      })
  }
}
