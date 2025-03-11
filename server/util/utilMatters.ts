import fs from 'fs/promises';
import path from 'path';
import { IUser } from '../models/userModel';
import jwt from 'jsonwebtoken';

const authToken: string = process.env.JWT_SECRET || 'slkdfjaslnvlksdlkjflksndlkmalkjskjsoiweoiuouewoijlkdfklasjdfkj';

async function deleteImage(imagePath: string): Promise<void> {
    try {
        const fullPath = path.join(__dirname, '..', 'assets', 'images', imagePath);
        await fs.access(fullPath); // Check if file exists
        await fs.unlink(fullPath); // Delete file
        console.log(`Image ${imagePath} deleted successfully.`);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.log(`Image ${imagePath} does not exist.`);
        } else {
            console.error(`Error deleting image ${imagePath}:`, error);
        }
    }
}

export const getJwtToken = (user: IUser, duration: any) => {
    return jwt.sign({ userId: user._id, role: user.role }, authToken, {
        expiresIn: duration,
    });
}

export default deleteImage;
