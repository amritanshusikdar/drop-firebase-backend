import { admin, db } from '@admin/init';
import { NextFunction, Request, Response } from 'express';

export const firebaseAuthorization = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.header('authorization')?.startsWith('Bearer ')) {
        const idToken = req
            .header('authorization')
            ?.split('Bearer ')[1] as string;
        try {
            const ref = await admin.auth().verifyIdToken(idToken);
            const user = await db
                .collection('users')
                .where('userId', '==', ref.uid)
                .limit(1)
                .get();
            req.body.user = {
                uid: ref.uid,
                handle: user.docs[0].data().handle,
            };
            return next();
        } catch (error) {
            console.error('No token found!');
            return res.status(403).json({ error: 'Unauthorized' });
        }
    } else {
        console.error('No token found!');
        return res.status(403).json({ error: 'Unauthorized' });
    }
};
