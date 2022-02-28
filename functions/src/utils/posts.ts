import { admin, db } from '@admin/init';
import BusBoy from 'busboy';
import { Request, Response } from 'express';
import functions = require('firebase-functions');

interface Post {
    userId: string;
}

type Posts = Post[];

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts: Posts = [];
        const ref = await db
            .collection('posts')
            .orderBy('createdAt', 'desc')
            .get();
        ref.forEach((doc) => posts.push({ userId: doc.id, ...doc.data() }));
        return res.json(posts);
    } catch (error) {
        console.error(error);
        return res
            .status(400)
            .json({ message: 'Cannot get data from database' });
    }
};

export const makePost = async (req: Request, res: Response) => {
    try {
        const newPost = {
            userHandle: req.body.user.handle,
            body: req.body.body,
            createdAt: new Date().toISOString(),
        };
        const ref = await db.collection('posts').add(newPost);
        return res.json({
            message: `Document ${ref.id} created successfully!`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong!' });
    }
};

export const uploadImage = functions.https.onRequest(
    async (req: functions.https.Request, res: Response) => {
        const path = await import('path');
        const os = await import('os');
        const fs = await import('fs');

        const busboy = new BusBoy({ headers: req.headers });

        let imageToBeUploaded: {
            filepath: string;
            mimetype: string;
        } = { filepath: '', mimetype: '' };

        let imageFileName = '';
        // String for image token
        const generatedToken =
            'daskjdakliweuroptiwuertnbzczxcvnzxcvkfsd7tsdjaskld';

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            console.log(fieldname, file, filename, encoding, mimetype);
            if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
                return res
                    .status(400)
                    .json({ error: 'Wrong file type submitted' });
            }
            // my.image.png => ['my', 'image', 'png']
            const imageExtension =
                filename.split('.')[filename.split('.').length - 1];
            // 32756238461724837.png
            imageFileName = `${Math.round(
                Math.random() * 1000000000000
            ).toString()}.${imageExtension}`;
            const filepath = path.join(os.tmpdir(), imageFileName);
            imageToBeUploaded = { filepath, mimetype };
            file.pipe(fs.createWriteStream(filepath));
            return;
        });
        busboy.on('finish', () => {
            admin
                .storage()
                .bucket()
                .upload(imageToBeUploaded.filepath, {
                    resumable: false,
                    metadata: {
                        metadata: {
                            contentType: imageToBeUploaded.mimetype,
                            // Generate token to be appended to imageUrl
                            firebaseStorageDownloadTokens: generatedToken,
                        },
                    },
                })
                .then(() => {
                    // Append token to url
                    // const imageUrl = `https://firebasestorage.googleapis.com
                    // /v0/b/${config.storageBucket}/o/${imageFileName}
                    // ?alt=media&token=${generatedToken}`;
                    return db
                        .doc(`/users/${req.body.handle}`)
                        .update({ imageUrl: 'image Uploaded' });
                })
                .then(() => {
                    return res.json({ message: 'image uploaded successfully' });
                })
                .catch((err) => {
                    console.error(err);
                    return res
                        .status(500)
                        .json({ error: 'something went wrong' });
                });
        });
        busboy.end(req.rawBody);
    }
);
