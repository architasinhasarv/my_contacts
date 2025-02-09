const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); // For sending emails
// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

// desc Register a new User
// @route Post /api/users/register
// @access public 
const registerUser =asyncHandler(async (req,res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory")
    }

    const UserAvailable = await User.findOne({email});
    if (UserAvailable){
        res.status(400);
        throw new Error("User already exists.")
    }

    const HashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        username,
        email,
        password: HashedPassword
    });
    // Send response immediately
  res.status(201).json({
    _id: user._id,
    email: user.email,
    message: "Registration successful. Check your email for a confirmation.",
  });

  // Send email asynchronously (without delaying response)
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Our Platform",
      text: `Hello ${username},\n\nThank you for signing up! Your registration was successful. We're happy to have you on board!\n\nBest regards,\nThe Team`,
    });
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
});


// desc Register a new User
// @route Post /api/users/register
// @access public 
const loginUser = asyncHandler(async (req,res) => {
    const {email, password} = req.body;
    if (!email || !password){
        res.status(400);
        throw new Error("User must provide there email and password")
    }
    const user = await User.findOne({email});
    if (user && await bcrypt.compare(password, user.password)){
        const accesstoken = jwt.sign({
            user:{
                username: user.username,
                email : user.email,
                id : user.id
            },
        }, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"1d"}
    );
        res.status(200);
        res.json({accesstoken});
    } else{
        res.status(401);
        throw new Error("email or password is not valid")
    }
});

// desc Register a new User
// @route Post /api/users/register
// @access private 
const currentrUser =asyncHandler(async  (req,res) => {
    res.json(req.user)
});

module.exports = {registerUser, loginUser, currentrUser};