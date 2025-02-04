import express, { Request, Response } from 'express';
import Cart from '../controller/cartController';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const data = await Cart.getAll();
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const data = await Cart.getCart(req.params.id);
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const data = await Cart.save(req.body);
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.put('/add/:id', async (req: Request, res: Response) => {
    try {
        const data = await Cart.addItemToCart(req.params.id, req.body);
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.put('/items/:cartId', async (req: Request, res: Response) => {
    try {
        const data = await Cart.updateCartItems(req.params.cartId, req.body);
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.delete('/:cartId/:itemId', async (req: Request, res: Response) => {
    try {
        await Cart.deleteItem(req.params.cartId, req.params.itemId);
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

export default router;
