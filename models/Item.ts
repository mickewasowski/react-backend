import mongoose, { Document, Schema, Types } from 'mongoose';

interface IComment {
    id: string;
    userId: string;
    authorName?: string;
    isAnon: boolean;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

// Define the Comment type as a Mongoose schema
const CommentSchema = new Schema<IComment>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: false
    },
    isAnon: {
        type: Boolean,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);

export interface IItem extends Document {
    name: string;
    description?: string;
    type?: string;
    image?: string;
    owner: Types.ObjectId;
    additionalData?: Record<string, any>;
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
    hasSameOwner(ownerId: string): boolean;
}

const ItemSchema = new Schema<IItem>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: String
    },
    image: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    additionalData: {
        type: Schema.Types.Mixed
    },
    comments: {
        type: [CommentSchema],
        default: []
    }
}, {
    timestamps: true
});

ItemSchema.pre("save", async function (next) {
    const item = this as IItem;

    if (!this.isModified()) {
        console.log(`Item ${item._id} is not modified`);
    }
    
    return next();
});

ItemSchema.methods.hasSameOwner = function (ownerId: string): boolean {
    const item = this as IItem;
    return item.owner.toString() === ownerId;
}

const Item = mongoose.model<IItem>("Item", ItemSchema);

export default Item;
