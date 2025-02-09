const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required: [true, "Please provide the user name"]
    },
    email :{
        type:String,
        required: [true, "Please provide the user email"],
        unique: [true, "This email already exist"]
    },
    password :{
        type:String,
        required: [true, "Please provide the password"]
    }
}, {
    timestamps:true,
    collection: "users"
});

module.exports = mongoose.model("User", userSchema);