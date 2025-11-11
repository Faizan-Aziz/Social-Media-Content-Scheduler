import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import databaseconnection from "./Database/conn.js";
import UserRoutes from './routes/user.js';
import postRoutes from "./routes/post.js";
import cors from "cors"; 


const app = express();
const port = 5000;

app.use(cors({
  origin: "http://localhost:5173", // Your React frontend
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Allowed methods
}));

app.use(express.json());   //  to automatically convert the JSON data string which is recived from frontend covert into a convenient JavaScript object that your server can use so that we can acsee request.body  other wise it is indefined
app.use(cookieParser())

dotenv.config();         // ✅ Load environment variables BEFORE using them
databaseconnection       //database used we used



app.use('/api/auth', UserRoutes);
app.use("/api/posts", postRoutes);





app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date() })
})



app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`⏰ Scheduler started - checking posts every minute`);
});
