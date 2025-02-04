import express, { Request, Response } from 'express';
import Item from '../controller/itemController';
import multer from 'multer';

const router = express.Router();

router.get('/all', async (req: Request, res: Response) => {
    try {
        const data = await Item.getAll();
        res.status(200).json({ data: data });
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

router.get('/discounts', async (req: Request, res: Response) => {
    try {
        const data = await Item.getDiscounts();
        res.status(200).json({ data: data });
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

router.get('/category/:category', async (req: Request, res: Response) => {
    try {
        const data = await Item.getByCategory(req.params.category);
        res.status(200).json({ data: data });
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const data = await Item.getItem(req.params.id);
        res.status(200).json({ data: data });
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

router.get('/store/:storeId', async (req: Request, res: Response) => {
    try {
        const data = await Item.getStoreItems(req.params.storeId);
        res.status(200).json({ data: data });
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

router.get('/search/:keyword', async (req: Request, res: Response) => {
    try {
        const data = await Item.getByName(req.params.keyword);
        res.status(200).json({ data: data });
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, 'item_' + uniqueSuffix + '.png');
    }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req: Request, res: Response) => {
    try {
        if(!req.file) throw new Error('Item should have a image');

        const data = await Item.save(req.body, req.file);
        res.status(200).json({ success: true, data: data });
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

router.put('/:itemId', upload.single('image'), async (req: Request, res: Response) => {
    try {
        const data = await Item.update(req.params.itemId, req.body, req.file);
        res.status(200).json({ success: true, data: data });
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

router.put('/active/:itemId', async (req: Request, res: Response) => {
    try {
        const data = await Item.setItemActive(req.params.itemId);
        res.status(200).json({ success: true, data: data });
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

router.put('/active/all/true', async (req: Request, res: Response) => {
    try {
        const data = await Item.setItemsActiveAll();
        res.status(200).json({ success: true, data: data });
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

router.delete('/:itemId', async (req: Request, res: Response) => {
    try {
        await Item.delete(req.params.itemId);
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ err: err });
    }
});

export default router;
