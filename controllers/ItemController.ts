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

        const items = await Item.find({}).skip(startIndex).limit(limit).select(['-__v']);

        res.status(200).json({ success: true, count: items.length, items })
    } else {
        res.status(400).json({ success: false, message: 'Page and Limit must be provided!' });
    }
});

// @Desc Get all items count
// @Route /api/item/search?q1=salad&q2=shopska
// @Method GET
export const searchItem = asyncHandler(async (req: Request, res: Response) => {
    const queryParams = req.query;
    let allWordsFromQuery: string[] = [];

    for (const key in queryParams) {
        if (key.startsWith('q')) {
            allWordsFromQuery.push(queryParams[key] as string);
        }
    }
    
    if (allWordsFromQuery) {
        const items = (await Item.find({}))
            .filter(x => allWordsFromQuery.includes(x.name)
                || allWordsFromQuery.some(word => x.description?.includes(word))
                || allWordsFromQuery.some(word => x.additionalData?.ingredients?.includes(word)));

        if (items) {
            res.status(200).json({ success: true, count: items.length, items });
        } else {
            res.status(404).json({ success: false, message: 'No items found!' });
        }
    } else {
        res.status(400).json({ success: false, message: 'No search query was provided!' });
    }
});

// @Desc Get all items count
// @Route /api/item/owned
// @Method GET
export const getAllItemsPerOwner = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.query.ownerId;
    const token = req.headers.authorization?.replace('Bearer ', '') || '';

    const { success, payload } = verifyToken(token);

    if (!success || !payload) {
        res.status(500).json({success, message: "Unauthorized"});
        return;
    }

    if (!ownerId) {
        res.status(400).json({success, message: "No owner ID has been provided!"});
        return;
    }

    const items = await Item.find({ owner: ownerId });

    if (items) {
        res.status(200).json({ success: true, count: items.length, items });
    } else {
        res.status(404).json({ success: false, message: 'No items found!' });
    }
    return;
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
    item.additionalData = newItem.additionalData ?? item.additionalData;

    await item.save();

    res.status(201).json({ success: true, item});
});

// @Desc Get latest 3 added recipes
// @Route /api/item/latest
// @Method GET
export const getLatestThreeAdded = asyncHandler(async (req: Request, res: Response) => {
    const allItems = await Item.find().sort({ createdAt: -1 }).limit(3).select(['-__v']);
    res.status(200).json({ success: true, items: allItems });
});

// @Desc add new item
// @Route /api/item
// @Method POST
export const postItem = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, type, image, additionalData } = req.body;
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
        name, description, type, image, owner: payload.id, additionalData
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
