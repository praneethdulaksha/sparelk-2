import express, { Request, Response } from 'express';
import userController from '../controller/userController';
import { getJwtToken } from '../util/utilMatters';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await userController.getAll();
        res.status(200).json({ data: result });
    } catch (err) {
        res.status(500).json({ data: err });
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
router.post('/register', upload.single('image'), async (req: Request, res: Response) => {
    try {
        const result = await userController.register(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, err: err });
    }
});

router.put('/verify-email/:code', async (req: Request, res: Response) => {
    try {
        await userController.verify(req.params.code);
        console.log('sdf')
        res.status(200).json({ success: true });
    } catch (err: any) {
        res.status(500).json({ success: false, err: err.message });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const result = await userController.update(req.params.id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, err: err });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await userController.delete(req.params.id);
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, err: err });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const result: any = await userController.login(req.body.email, req.body.password);
        if (result) {
            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 3 * 60 * 60 * 1000 // 3 hours
            });

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 72 * 60 * 60 * 1000 // 72 hours
            });

            res.status(200).json({
                success: true,
                user: result.user,
                cart: result.cart,
                store: result.store,
            });
        } else {
            throw new Error('Invalid Credentials')
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ success: false, err: err.message });
    }
});

router.post('/refresh', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!);
        const newAccessToken = getJwtToken(decoded as any, '3h');

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3 * 60 * 60 * 1000
        });

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(403).json({ success: false, message: 'Invalid refresh token' });
    }
});

export default router;
