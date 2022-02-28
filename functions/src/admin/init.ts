import admin from 'firebase-admin';
import fb from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import functions = require('firebase-functions');

// Firebase Admin
admin.initializeApp();
const db = admin.firestore();

export { admin, db };

// API Information and Firebase
const startFirebase = () => {
    if (process.env.FUNCTIONS_EMULATOR === 'true') {
        fb.initializeApp({
            apiKey: 'randomAPIKey',
            appId: 'randomAppId',
            projectId: 'test-project-id',
            databaseURL: 'test-db-url',
            storageBucket: 'test-storage-bucket-url',
        });
        fb.auth().useEmulator('http://localhost:9099');
        fb.functions().useEmulator('localhost', 5001);
        fb.firestore().useEmulator('localhost', 8080);
        fb.storage().useEmulator('localhost', 9199);
    } else {
        const CONFIG = functions.config();
        fb.initializeApp(CONFIG);
    }

    return fb;
};

export const firebase = startFirebase();
