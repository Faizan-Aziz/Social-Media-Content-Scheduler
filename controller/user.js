import UserModel from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  try {

    console.log("🔍 DEBUG - Full req.body:", req.body);
    //step no 1 check no already exist or not 
    let { name , email, password} = req.body  // used the same keywords while destructuring and when data send from frontend to backend used the same name 

    const isExist = await UserModel.findOne({ email });

    if (isExist) {
      return res.status(409).json({ message: "User with this email already exist"})
    }

    //step no 2 if not then hashed the passowrd 

    const hashedpassword = await bcrypt.hash(password, 10)

    //step no 3 saved the password

    password = hashedpassword;
    const newUser = new UserModel({ name , email, password });
    await newUser.save()


    res.status(200).json({
      message: "User register succesfully",
      newUser
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" })
  }
};



const cookieOptions = {
  httpOnly: true,
  secure: false, // Set to true in production
  sameSite: 'Lax',
  maxAge: 60 * 60 * 1000 // expire time of 1 hour
};


export const login = async (req, res) => {
  try {

    // step no 1 check the user is already exist or not by comparing the number 

    const { email, password } = req.body

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(409).json({ message: "User doesnot Exist please register first" })
    }

    //step no 2 compare the password 

    const passwordmatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordmatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    //step no 3 now generate the web token and send it to the frotnt end

    const token = jwt.sign(

      { userID: user._id }, //payload we send to the front end on login

      process.env.JWT_SECRET,  //secret key

      { expiresIn: "1h" }   // Expiration time

    )


    //save the value in the brower  when coming on that route 
    res.cookie("token", token, cookieOptions)  //it take 3 arguments key , value , object 

    // ✅ BEST PRACTICE - Convert to plain object first
    const userObject = user.toObject(); // Convert Mongoose document to plain object
    delete userObject.password; // Now safely delete password

    return res.status(200).json({ message: "login succesfully",  user: userObject })

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server Error" })

  }
}



export const logout = async (req, res) => {
  try {
    res.clearCookie('token', cookieOptions);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}



export const dashboard = async (req, res) => {
  try {
   
    res.json({ message: 'welcome to the successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}


