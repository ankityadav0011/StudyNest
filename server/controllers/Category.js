const Category = require("../models/Category");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    // Extract data from request body
    const { name, description } = req.body;

    // Validation: Ensure both fields are provided
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create category in DB
    const categoryDetails = await Category.create({ name, description });

    console.log("Category Created:", categoryDetails);

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Category Created Successfully",
      data: categoryDetails,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Get all categories
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({}, "name description");

    return res.status(200).json({
      success: true,
      message: "All categories retrieved successfully",
      data: allCategories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// Category Page Details with Courses
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // Validate category ID
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    // Get selected category with published courses
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: { path: "ratingAndReviews" },
      })
      .exec();

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // If no courses found in this category
    if (selectedCategory.courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    // Fetch other categories excluding the selected one
    const otherCategories = await Category.find({ _id: { $ne: categoryId } });

    // Pick a random category from remaining categories
    const randomIndex = Math.floor(Math.random() * otherCategories.length);
    const differentCategory = await Category.findById(
      otherCategories[randomIndex]?._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();

    // Fetch all courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();

    const allCourses = allCategories.flatMap((category) => category.courses);

    // Get top-selling courses (sorted by 'sold' field)
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    console.error("Error fetching category page details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
