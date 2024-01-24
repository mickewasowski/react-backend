import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Item from '../models/Item';
import { verifyToken } from '../utils/token';

// @Desc Get all itemss
// @Route /api/item?page=1&limit=10
// @Method GET
export const getAllItems = asyncHandler(async (req: Request, res: Response) => {
    if (typeof req.query.page === 'string' && typeof req.query.limit === 'string') {
        const page: number = parseInt(req.query.page);
        const limit: number = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;

        const items = await Item.find({}).skip(startIndex).limit(limit).select(['-__v', '-owner']);

        res.status(201).json({ success: true, count: items.length, items })
    } else {
        res.status(400).json({ success: false, message: 'Page and Limit must be provided!' });
    }
});

// @Desc Get all items count
// @Route /api/item/count
// @Method GET
export const getAllItemsCount = asyncHandler(async (req: Request, res: Response) => {
    const count = await Item.countDocuments();
    res.status(200).json({ success: true, count });
});

// @Desc update item 
// @Route /api/item
// @Method PATCH
export const updateItem = asyncHandler (async (req: Request, res: Response) => {

    const newItem = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    
    const {success, payload} = verifyToken(token);

    if(!success || !payload) {
        res.status(500).json({success, message: "Unauthorized"});
        return;
    }

    const item = await getMutableItem(newItem._id, payload.id, res);
    if (!item) return;
    
    item.name = newItem.name ?? item.name;
    item.description = newItem.description ?? item.description;
    item.type = newItem.type ?? item.type;
    item.image = newItem.image ?? item.image;

    await item.save();

    res.status(201).json({ success: true, item});
});

// @Desc add new item
// @Route /api/item
// @Method POST
export const postItem = asyncHandler(async (req: Request, res: Response) => {

    const { name, description, type, image } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '') || '';

    if(!token) {
        res.status(401).json({success: false, message: "Token missing"});
        return;
    }   

    const {success, payload} = verifyToken(token);

    if(!success || !payload) {
        res.status(500).json({success, message: "Unauthorized"});
        return;
    }    

    if(!name) {
        res.status(402).json({success: false, message: "missing 'name' field"});
        return;
    }
    
    const item = new Item({
        name, description, type, image, owner: payload.id
    });

    await item.save();

    res.status(201).json({ success: true, item});
});

// @Desc delete item
// @Route /api/item
// @Method DELETE
export const deleteItem = asyncHandler(async (req: Request, res: Response) => {

    const { _id } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    
    const {success, payload} = verifyToken(token);

    if(!success || !payload) {
        res.status(500).json({success, message: "Unauthorized"});
        return;
    } 

    const item = await getMutableItem(_id, payload.id, res);
    if (!item) return;

    await item.remove();
    
    res.status(201).json({ success: true, message: "deleted"});
});

const getMutableItem = async (itemId: string, ownerId: string, res: Response) => {
    if(!itemId) {
        res.status(401).json({success: true, message: "Item's '_id' is required"});
        return;
    }

    const item = await Item.findOne({ _id: itemId });
    
    if(!item) {
        res.status(402).json({ success: false, message: "Item not found"});
        return;
    }

    if(!item.hasSameOwner(ownerId)){
        res.status(403).json({ success: false, message: "Only the owner of an item can update the item"});
        return;
    }

    return item;
};
