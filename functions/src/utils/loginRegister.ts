import { db, firebase } from '@admin/init';
import { validateLoginData, validateRegisterData } from '@utils/validators';
import { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };

    const { valid, errors } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);

    try {
        const ref = await firebase
            .auth()
            .signInWithEmailAndPassword(user.email, user.password);
        const token: string = (await ref.user?.getIdToken()) as string;
        return res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        if (
            error.code === 'auth/wrong-password' ||
            error.code === 'auth/user-not-found'
        ) {
            return res
                .status(403)
                .json({ general: 'Wrong credentials, please try again.' });
        }
        return res.status(500).json({ error: error.code });
    }
};

export const register = async (req: Request, res: Response) => {
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
        contactNumber: req.body.contactNumber,
    };

    const { valid, errors } = validateRegisterData(newUser);
    if (!valid) return res.status(400).json(errors);

    let token: string;
    let userId: string;
    try {
        const ref = await db.doc(`/users/${newUser.handle}`).get();
        if (ref.exists) {
            return res
                .status(400)
                .json({ handle: 'This handle is already taken' });
        } else {
            const newUserRef = await firebase
                .auth()
                .createUserWithEmailAndPassword(
                    newUser.email,
                    newUser.password
                );
            userId = newUserRef.user?.uid as string;
            token = (await newUserRef.user?.getIdToken()) as string;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId,
            };
            await db.doc(`/users/${newUser.handle}`).set(userCredentials);
            return res.status(201).json({ token });
        }
    } catch (error) {
        console.error(error);
        if (error.code === 'auth/email-already-in-use') {
            return res.status(400).json({ email: 'Email already in use' });
        }
        return res.status(500).json({ error: error.code });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users: { userId: string; [key: string]: string }[] = [];

        const ref = await db
            .collection('users')
            .orderBy('createdAt', 'desc')
            .get();

        ref.forEach((doc) => {
            users.push({
                userId: doc.id,
                ...doc.data(),
            });
        });
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Cannot get data from server' });
    }
};
