import usermodel from "../models/user.js"
import jwt from "jsonwebtoken"


const auth = async(req,res,next)=>{

    const token = req.cookies.token;  //the token we saved on the brower we will now get it 

    if (!token) {
        return res.status(400).json({ message: 'NO token, Authorization Denied' });
    }

    try {

        const decode= jwt.verify(token,process.env.JWT_SECRET)
        // console.log(decode);
        
        if(!decode){
            return res.status(401).json({message:"Token is not valid"})
        }

        let LogedINuserID=decode.userID
        req.user=await usermodel.findById(LogedINuserID).select("-password")
        req.userID = LogedINuserID
        
        next()

    } catch (error) {
        
        return res.status(401).json({ message:'Token is not Valid'})

    }

}

export default auth