// //Import the required modules
// const express = require("express")
// const router = express.Router()
// const {
//   capturePayment,
//   verifySignature,
//   verifyPayment,
//   sendPaymentSuccessEmail,
// } = require("../controllers/Payments")
// const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
// router.post("/capturePayment", capturePayment)
// router.post("/verifyPayment", verifyPayment)
// router.post(
//   "/sendPaymentSuccessEmail",
//   sendPaymentSuccessEmail
// )
// router.post("/verifySignature", verifySignature)

// module.exports = router


// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment",auth, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router

