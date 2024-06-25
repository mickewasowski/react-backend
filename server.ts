import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db';
import { pageNotFound, errorHandler } from './routes/ErrorMiddleware';
import UserRoutes from './routes/UserRoutes';
import ItemRoutes from './routes/ItemRoutes';
import cors from 'cors';
import { Server } from 'socket.io';
import Item, { Comment } from './models/Item';
import mongoose from 'mongoose';

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

const io = new Server(5505, {
    cors: {
        origin: [ 'http://localhost:5173' ]
    }
});

io.on('connection', socket => {
    console.log(socket.id);

    socket.on('typing-event-send', (recipeId) => {
        console.log(`typing event for ${recipeId}`);
        socket.emit('typing-event-receive', 'test receive');
    });

    socket.on('add-comment', async ({ recipeId, authorId, commentText }) => {
        console.log('add comment')
        const recipe = await Item.findOne({ _id: recipeId });
        if (recipe) {
            const comment = new Comment({ id: new mongoose.Types.ObjectId().toString(), userId: authorId, isAnon: false, content: commentText, createdAt: Date.now(), updatedAt: Date.now() });
            recipe.comments.push(comment);
            await recipe.save();
            console.log('Successfully added comment to recipeId:', recipe.id);
            io.emit('add-comment-success', recipe.id);
        }
    })
});
