import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import sequelize from './config/database.js';
import User from './models/user.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("Database successfuly sync")
    } catch (error) {
        console.error("Failed to connect to database ", error)
    }
})()
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server running on port ', PORT)
    
})