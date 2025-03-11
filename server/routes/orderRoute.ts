import express, { Request, Response } from 'express';
import Order from '../controller/orderController';

const router = express.Router();

router.post('/:cartOrItem', async (req: Request, res: Response) => {
    try {
        const data = await Order.saveOrder(req.params.cartOrItem, req.body);
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ err });
    }
});

router.get('/:userId', async (req: Request, res: Response) => {
    try {
        const data = await Order.getOrders(req.params.userId);
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ err });
    }
});

router.get('/reviews/:itemId', async (req: Request, res: Response) => {
    try {
        const data = await Order.getReviewsByItemId(req.params.itemId);
        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
});

router.put('/', async (req: Request, res: Response) => {
    try {
        const data = await Order.updateOrder(req.body);
        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
});

router.put('/review', async (req: Request, res: Response) => {
    try {
        const data = await Order.saveReview(req.body);
        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
});

export default router;
