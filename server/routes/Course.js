//Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers
// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getInstructorCourses,
  getFullCourseDetails,
  deleteCourse,
  editCourse,
} = require("../controllers/Course")
// Tags Controllers Import

// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category")

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection")

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRatingReview,
} = require("../controllers/RatingAndReview")
const {
  updateCourseProgress,
} = require("../controllers/courseProgress")
// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse",auth,createCourse)
// Edit Course routes
router.post("/editCourse",auth,editCourse)
//Add a Section to a Course
router.post("/addSection",auth,createSection)
// Update a Section
router.post("/updateSection",auth,updateSection)
// Delete a Section
router.post("/deleteSection",auth,deleteSection)
// Edit Sub Section
router.post("/updateSubSection",auth,updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection",auth,deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection",auth,createSubSection)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses",auth,getInstructorCourses)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails",auth,getFullCourseDetails)
// To Update Course Progress
router.post("/updateCourseProgress",auth,updateCourseProgress)
// To get Course Progress
// router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory",createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails",categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating",auth,createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingReview)

module.exports = router
