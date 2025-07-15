const User = require("../models/User");
const mailsender = require("../utils/mailSender");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const bcrypt = require("bcrypt")


// reset passwordtoken
exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      })
    }
    const token = crypto.randomBytes(20).toString("hex")

    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    )
    console.log("DETAILS", updatedDetails)

    // const url = `http://localhost:3000/update-password/${token}`
    const url = `https://studynotion-edtech-project.vercel.app/update-password/${token}`

    await mailSender(
      email,
      "Password Reset",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    )

    res.json({
      success: true,
      message:
        "Email Sent Successfully, Please Check Your Email to Continue Further",
    })
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Sending the Reset Message`,
    })
  }
}

// reset password 
exports.resetpassword = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { password, confirmPassword, token } = req.body;

    // Validate fields
    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    // Get user details using the token
    const userDetails = await User.findOne({ token: token });

    // Validate token
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Check if token has expired
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token has expired, please regenerate the token",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear token fields
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword, token: null, resetPasswordExpires: null },
      { new: true }
    );

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Password not updated",
    });
  }
};

