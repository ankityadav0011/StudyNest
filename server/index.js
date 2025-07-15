const express = require("express")

const app = express();


const userRoutes = require("./routes/user")
const profileRoutes = require("./routes/profile")
const PaymentRoutes = require("./routes/Payment")
const courseRoutes = require("./routes/Course")
const contactusRoute = require("./routes/Contact")
const database = require("./config/database")
const cookieParser = require("cookie-parser")
const cors = require("cors");
const {cloudinaryConnect}=require("./config/cloudinary")
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv");
const Profile = require("./models/Profile");

dotenv.config(); 
const PORT = process.env.PORT |4040;

// database connect 
database.connect();

// middlewears
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:"http://localhost:3000",
    credentials:true,

  })
)   

app.use(
  fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp",
  })
)

// connection to cloudinary 
cloudinaryConnect();

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",PaymentRoutes);
app.use("/api/v1/reach",contactusRoute);
// default route 
app.get("/",(req,res)=>{
  return res.json({
    success:true,
    message:"Your server is running",
  })
})

// activate the serve r

app.listen(PORT,()=>{
   console.log(`App is running at ${PORT}`)
})








