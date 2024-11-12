import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB";
import { errorHandler } from "./middleware/errorHandler";
import userRoutes from "./routes/userRoutes";
import candidateRoutes from "./routes/candidateRoutes";
import cors from "cors";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(express.json());
app.use(cors({
  origin: '*' 
}));
app.use('/api/users', userRoutes);
app.use('/api/candidates', candidateRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  export default app;