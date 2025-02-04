import fs from 'fs/promises';
import path from 'path';

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

export default deleteImage;
