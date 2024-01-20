import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db';
import { pageNotFound, errorHandler } from './routes/ErrorMiddleware';
import UserRoutes from './routes/UserRoutes';
import ItemRoutes from './routes/ItemRoutes';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app: Application = express();

app.use(cors());

connectDB();
app.use(express.json());

// Default
app.get("/api", (req: Request, res: Response) =>  {
    res.status(200).json({ message: "Welcome!" });
})

// Routes
app.use("/api/user", UserRoutes);
app.use("/api/item", ItemRoutes);
app.use(pageNotFound);

app.use(errorHandler);


app.listen(PORT, (): void => console.log(`Server is running on http://localhost:${PORT}`));