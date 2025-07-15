const mongoose= require("mongoose");

const userSchema = new mongoose.Schema({
  
  firstName:{
    type:String,
    required:true,
    trim:true,
  },
  lastName:{
    type:String,
    required:true,
    trim:true,
  }
  ,email:{
     type:String,
     required:true,
     trim:true,
  }
  ,password:{
    type:String,
    required:true, 
  },
  accountType:{
    type:String,
    enum:["Admin","Student","Instructor"],
    required:true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  approved: {
    type: Boolean,
    default: true,
  },
  additionalDetails:{
     type:mongoose.Schema.Types.ObjectId,
     required:true,
     ref:"Profile",
  },
  //Schema.Types.ObjectId is a special type in Mongoose used to store references to other documents in MongoDB. It essentially holds an ID pointing to another document in the database.info about below line 35 
  courses:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Course",
    }
  ],
  image:{
    type:String,
    
  },
  token:{
    type:String,
  },
  resetPasswordExpires:{
    type:Date,
  },
  courseProgress:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"CourseProgress",
    }
  ],
},
    {timestamps:true}
);

// export this model 

module.exports= mongoose.model("user",userSchema);
