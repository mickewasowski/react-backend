import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Item from '../models/Item';
import { verifyToken } from '../utils/token';
import User from '../models/User';

// @Desc Get all itemss
// @Route /api/item?page=1&limit=10
// @Method GET
export const getAllItems = asyncHandler(async (req: Request, res: Response) => {
    if (typeof req.query.page === 'string' && typeof req.query.limit === 'string') {
        const page: number = parseInt(req.query.page);
        const limit: number = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;

        let items;
        const queryParams = req.query;
        let allWordsFromQuery: string[] = [];

        for (const key in queryParams) {
            if (key.startsWith('q')) {
                allWordsFromQuery.push(queryParams[key] as string);
            }
        }

        if (allWordsFromQuery.length) {
            items = await Item.find({
                $or: [
                    { name: { $regex: allWordsFromQuery.map(word => new RegExp(word, 'i')).join('|') } },
                    { description: { $regex: allWordsFromQuery.join('|'), $options: 'i' } },
                    { 'additionalData.ingredients': { 
                        $regex: allWordsFromQuery.join('|'), $options: 'i' 
                    }}
                ]
            })
            .sort({ createdAt: -1 }).skip(startIndex).limit(limit).select(['-__v'])
        } else {
            items = await Item.find({ }).sort({ createdAt: -1 }).skip(startIndex).limit(limit).select(['-__v']);
        }

        res.status(200).json({ success: true, count: items.length, items })
    } else {
        res.status(400).json({ success: false, message: 'Page and Limit must be provided!' });
    }
});

//DEPRECATED
// @Desc Get all items count
// @Route /api/item/search?q1=salad&q2=shopska
// @Method GET
// export const searchItem = asyncHandler(async (req: Request, res: Response) => {
//     if (typeof req.query.page === 'string' && typeof req.query.limit === 'string') {
//         const page: number = parseInt(req.query.page);
//         const limit: number = parseInt(req.query.limit);
//         const startIndex = (page - 1) * limit;
//         const queryParams = req.query;
//         let allWordsFromQuery: string[] = [];
    
//         for (const key in queryParams) {
//             if (key.startsWith('q')) {
//                 allWordsFromQuery.push(queryParams[key] as string);
//             }
//         }
        
//         if (allWordsFromQuery) {
//             const count = await Item.find({
//                 $or: [
//                     { name: { $in: allWordsFromQuery } },
//                     { description: { $regex: allWordsFromQuery.join('|'), $options: 'i' } },
//                     { 'additionalData.ingredients': { $regex: allWordsFromQuery.join('|'), $options: 'i' } }
//                 ]
//             }).count();
//             const items = await Item.find({
//                 $or: [
//                     { name: { $in: allWordsFromQuery } },
//                     { description: { $regex: allWordsFromQuery.join('|'), $options: 'i' } },
//                     { 'additionalData.ingredients': { $regex: allWordsFromQuery.join('|'), $options: 'i' } }
//                 ]
//             })
//             .sort({ createdAt: -1 })
//             .skip(startIndex)
//             .limit(limit)
//             .select('-__v');
    
//             if (items) {
//                 res.status(200).json({ success: true, count, items });
//             } else {
//                 res.status(404).json({ success: false, message: 'No items found!' });
//             }
//         } else {
//             res.status(400).json({ success: false, message: 'No search query was provided!' });
//         }
//     }
// });

// @Desc Get all items count
// @Route /api/item/ownedCount
// @Method GET
export const getAllItemsCountPerOwner = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.query.ownerId;

    if (!ownerId) {
        res.status(400).json({ success: false, message: "No owner ID has been provided!"});
        return;
    }

    const owner = await User.findOne({ _id: ownerId });

    let items;
    const queryParams = req.query;
    let allWordsFromQuery: string[] = [];

    for (const key in queryParams) {
        if (key.startsWith('q')) {
            allWordsFromQuery.push(queryParams[key] as string);
        }
    }

    if (allWordsFromQuery.length && owner) {
        items = await Item.find({
            _id: { $in: owner.ownedRecipes },
            $or: [
                { name: { $regex: allWordsFromQuery.map(word => new RegExp(word, 'i')).join('|') } },
                { description: { $regex: allWordsFromQuery.join('|'), $options: 'i' } },
                { 'additionalData.ingredients': { 
                    $regex: allWordsFromQuery.join('|'), $options: 'i' 
                }}
            ]
        })
        .select('-__v');
    } else {
        items = await Item.find({ _id: { $in: owner?.ownedRecipes } });
    }

    if (items) {
        res.status(200).json({ success: true, count: items.length });
    } else {
        res.status(404).json({ success: false, message: 'No items found!' });
    }
});


// @Desc Get all items per owner
// @Route /api/item/owned?page=1&limit=10&id=someUserId
// @Method GET
export const getItemsPerOwner = asyncHandler(async (req: Request, res: Response) => {
    if (typeof req.query.page === 'string' && typeof req.query.limit === 'string' && typeof req.query.id === 'string') {
        const page: number = parseInt(req.query.page);
        const limit: number = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const ownerId = req.query.id;

        let items;
        const queryParams = req.query;
        let allWordsFromQuery: string[] = [];

        for (const key in queryParams) {
            if (key.startsWith('q')) {
                allWordsFromQuery.push(queryParams[key]?.toString().toLowerCase() as string);
            }
        }

        if (allWordsFromQuery.length) {
            items = await Item.find({
                owner: ownerId,
                $or: [
                    { name: { $regex: allWordsFromQuery.map(word => new RegExp(word, 'i')).join('|') } },
                    { description: { $regex: allWordsFromQuery.join('|'), $options: 'i' } },
                    { 'additionalData.ingredients': { 
                        $regex: allWordsFromQuery.join('|'), $options: 'i' 
                    }}
                ]
            })
            .skip(startIndex)
            .limit(limit)
            .select('-__v');
        } else {
            items = await Item.find({ owner: ownerId });
        }

        res.status(200).json({ success: true, count: items.length, items })
    } else {
        res.status(400).json({ success: false, message: 'Page, Limit and Id must be provided!' });
    }
});

// @Desc Get all items count
// @Route /api/item/count
// @Method GET
export const getAllItemsCount = asyncHandler(async (req: Request, res: Response) => {
    let count;
    const queryParams = req.query;
    let allWordsFromQuery: string[] = [];

    for (const key in queryParams) {
        if (key.startsWith('q')) {
            allWordsFromQuery.push(queryParams[key] as string);
        }
    }

    if (allWordsFromQuery.length) {
        count = await Item.find({
            $or: [
                { name: { $regex: allWordsFromQuery.map(word => new RegExp(word, 'i')).join('|') } },
                { description: { $regex: allWordsFromQuery.join('|'), $options: 'i' } },
                { 'additionalData.ingredients': { 
                    $regex: allWordsFromQuery.join('|'), $options: 'i' 
                }}
            ]
        })
        .select('-__v')
        .count();
    } else {
        count = await Item.countDocuments();
    }
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
    if (!item) {
        res.status(404).json({ success, message: "No item found with this ID!" });
        return;
    }
    
    item.name = newItem.name ?? item.name;
    item.description = newItem.description ?? item.description;
    item.type = newItem.type ?? item.type;
    item.image = newItem.image ?? item.image;

    const additionalData = JSON.parse(newItem.additionalData);
    item.additionalData = additionalData ?? item.additionalData;

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
    const { name, description, type, image, additionalData: additionalDataFromRequest } = req.body;
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

    const additionalData = JSON.parse(additionalDataFromRequest);
    
    const item = new Item({
        name, description, type, image, owner: payload.id, additionalData: additionalData
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
