import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Item from '../models/Item';
import { verifyToken } from '../utils/token';

// @Desc Get all itemss
// @Route /api/item
// @Method GET
export const getAllItems = asyncHandler(async (req: Request, res: Response) => {

    const items = await Item.find({}).select(['-__v']);
    res.status(201).json({ success: true, count: items.length, items });

})

// @Desc update item 
// @Route /api/item
// @Method PATCH
export const updateItem = asyncHandler (async (req: Request, res: Response) => {

    const newItem = req.body
    const token = req.headers.authorization?.replace('Bearer ', '') || ''    
    
    const {succes, payload} = verifyToken(token)

    if(!succes || !payload) {
        res.status(500).json({succes, message: "Unauthorized"})
        return
    }

    const item = await getMutableItem(newItem._id, payload.id, res)
    if (!item) return
    
    item.name = newItem.name ?? item.name
    item.description = newItem.description ?? item.description
    item.type = newItem.type ?? item.type
    item.image = newItem.image ?? item.image

    await item.save()

    res.status(201).json({ success: true, item})

})

// @Desc add new item
// @Route /api/item
// @Method POST
export const postItem = asyncHandler(async (req: Request, res: Response) => {

    const { name, description, type, image } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '') || ''
    
    if(!token) {
        res.status(401).json({succes: false, message: "Token missing"})
        return
    }   

    const {succes, payload} = verifyToken(token)

    if(!succes || !payload) {
        res.status(500).json({succes, message: "Unauthorized"})
        return
    }    

    if(!name) {
        res.status(402).json({succes: false, message: "missing 'name' field"})
        return
    }
    
    const item = new Item({
        name, description, type, image, owner: payload.id
    });

    await item.save();

    res.status(201).json({ success: true, item});

})

// @Desc delete item
// @Route /api/item
// @Method DELETE
export const deleteItem = asyncHandler(async (req: Request, res: Response) => {

    const { _id } = req.body
    const token = req.headers.authorization?.replace('Bearer ', '') || ''    
    
    const {succes, payload} = verifyToken(token)

    if(!succes || !payload) {
        res.status(500).json({succes, message: "Unauthorized"})
        return
    } 

    const item = await getMutableItem(_id, payload.id, res)
    if (!item) return

    await item.remove()
    
    res.status(201).json({ success: true, message: "deleted"})

})

const getMutableItem = async (itemId: string, ownerId: string, res: Response) => {
    if(!itemId) {
        res.status(401).json({succes: true, message: "Item's '_id' is required"})
        return
    }

    const item = await Item.findOne({ _id: itemId })
    
    if(!item) {
        res.status(402).json({ success: false, message: "Item not found"})
        return
    }

    if(!item.hasSameOwner(ownerId)){
        res.status(403).json({ success: false, message: "Only the owner of an item can update the item"})
        return
    }

    return item
}