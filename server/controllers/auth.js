import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users.js';

/* REGISTER */
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, picturePath,friends,location,occupation } = req.body;
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ firstName, lastName, email, password: hashedPassword, picturePath,friends,location,occupation,viewedProfile:Math.floor(Math.random() * 1000),impressions:Math.floor(Math.random() * 1000) });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* LOGIN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if(!user) return res.status(400).json({ message: "User does not exist." });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({msg : "Invalid crendentials"});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ result: user, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}