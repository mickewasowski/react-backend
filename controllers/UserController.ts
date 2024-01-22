import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import User from '../models/User';
import {generateToken, verifyToken} from '../utils/token';

// @Desc Get all users
// @Route /api/user
// @Method GET
export const getAll = asyncHandler(async (req: Request, res: Response) => {

    const token = req.headers.authorization?.replace('Bearer ', '') || ''    
    const {success, payload} = verifyToken(token)

    if(!success || !payload) {
        res.status(500).json({success, message: "Unauthorized"})
        return
    }

    const users = await User.find({}).select('-password')
    res.status(201).json({ success: true, count: users.length, users })

})

// @Desc Login 
// @Route /api/user/login
// @Method POST
export const login = asyncHandler (async (req: Request, res: Response) => {

    const { email, password } = req.body

    if(!email || !password) {
        res.status(406).json({success: false, message: 'Dont forget to add the Email and password to your request'})
        return 
    }

    const user = await User.findOne({ email })

    if(!user) {
        res.status(401).json({success: false, message: 'User not found'})
        return
    }

    if(!user.comparePassword(password)) {
        res.status(402).json({success: false, message: 'Password is incorrect'});
        return
        
    } 

    res.status(201).json({ success: true, user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        token: generateToken(user._id)
    }})

})

// @Desc Login 
// @Route /api/user
// @Method PATCH
export const updateUser = asyncHandler (async (req: Request, res: Response) => {

    const { email: newEmail, fullName: newFullName, password, newPassword } = req.body
    const token = req.headers.authorization?.replace('Bearer ', '') || ''    
    
    const {success, payload} = verifyToken(token)

    if(!success || !payload) {
        res.status(500).json({success, message: 'Unauthorized'})
        return
    }

    if(!password) {
        res.status(405).json({success: false, message: 'Password is required'})
        return 
    }

    const user = await User.findOne({ _id: payload.id })

    if(!user) {
        res.status(401).json({success: false, message: 'User not found'})
        return
    }

    if(!user.comparePassword(password)) {
        res.status(402).json({success: false, message: 'Password incorrect'})
        return        
    } 
    
    user.email = newEmail ?? user.email
    user.fullName = newFullName ?? user.fullName
    user.password = newPassword ?? user.password

    try {
        await user.save()
        res.status(201).json({ success: true, user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName
        }})
    } catch (error: any) {        
        if (error?.code === 11000  ){
            res.status(403).json({success: false, message: 'Email is already registered'})
            return
        }

        res.status(500).json({success: false, error})
    }    

})

// @Desc Register
// @Route /api/user/register
// @Method POST
export const register = asyncHandler(async (req: Request, res: Response) => {

    const { email, fullName, password } = req.body

    const existingUser = await User.findOne({ email })

    if(existingUser){
        res.status(403).json({success: false, message: 'Email is already registered'})
        return
    }

    const user = new User({
        email, fullName, password
    });

    await user.save();

    res.status(201).json({ success: true, user: {
        email: user.email,
        fullName: user.fullName
    } })

})