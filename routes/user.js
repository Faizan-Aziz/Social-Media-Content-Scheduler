import express from "express";
import { register, login, logout , dashboard} from "../controller/user.js"; 
import auth from "../middleware/auth.js"


const router = express.Router();

router.post('/register', register)

router.post('/login' , login)

router.post('/logout' , auth , logout)

router.get('/dashboard' ,auth, dashboard)


export default router;



