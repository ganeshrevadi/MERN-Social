import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

/* REGISTER */
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, picturePath,friends,location,occupation } = req.body;
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ firstName, lastName, email, password: hashedPassword, picturePath,friends,location,occupation,viewedProfile:Math.floor(Math.random() * 1000),impressions:Math.floor(Math.random() * 1000) });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}