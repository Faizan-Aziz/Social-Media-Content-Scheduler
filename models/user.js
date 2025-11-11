
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength: 50
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    }
}, { 
    timestamps: true 
});

// 1. Create the model correctly
const User = mongoose.model("User", UserSchema);

// 2. Export the model correctly
export default User;
