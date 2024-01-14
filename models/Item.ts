import mongoose, { ObjectId } from 'mongoose';

export interface IItem extends mongoose.Document {
    name: string,
    description?: string,
    type?: string,
    image?: string,
    owner: ObjectId,
    createdAt: Date,
    updatedAt: Date,
    hasSameOwner(item: string):boolean
}

const ItemSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
})

ItemSchema.pre("save", async function(next) {

    const item = this as unknown as IItem;

    if(!item.isModified()) console.log(`Item ${item._id} is not modified`)
    
    return next();

})

ItemSchema.methods.hasSameOwner =  function(owner: string) {
    const item = this as IItem;
    return item.owner.toString() === owner
}

const Item = mongoose.model<IItem>("Item", ItemSchema)

export default Item;