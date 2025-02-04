import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import Store from '../controller/storeController';

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/images/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        cb(null, `store_${uniqueSuffix}.png`);
    }
});
const upload = multer({ storage });

// Get all stores
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await Store.getAll();
        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
});

// Get store by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await Store.getByStoreId(req.params.id);
        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
});

// Create new store
router.post('/', upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.file) throw new Error('Item should have a image');
        
        const data = await Store.save(req.body, req.file);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
});

// Update store
router.put('/:storeId', upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await Store.update(req.params.storeId, req.body, req.file);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
});

// Delete store
router.delete('/:storeId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Store.delete(req.params.storeId);
        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
});

export default router;
