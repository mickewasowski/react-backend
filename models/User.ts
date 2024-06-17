import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends mongoose.Document {
    email: string;
    fullName: string;
    password: string;
    token?: string;
    likedRecipes: string[];
    ownedRecipes: string[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): boolean;
}

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    fullName: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true
    },

    likedRecipes: {
        type: [String],
        required: false,
    },

    ownedRecipes: {
        type: [String],
        required: false,
    },
}, {
    timestamps: true
});

UserSchema.pre("save", async function(next) {

    const user = this as IUser;

    if(!user.isModified("password")) return next()

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(user.password, salt)
    
    user.password = hash

    return next()

})

UserSchema.methods.comparePassword =  function(password: string) {
    const user = this as IUser
    return bcrypt.compareSync(password, user.password)
}

const User = mongoose.model<IUser>("User", UserSchema)

export default User