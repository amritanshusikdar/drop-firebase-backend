import { firebaseAuthorization } from '@utils/firebaseAuthorization';
import { getAllUsers, login, register } from '@utils/loginRegister';
import { getAllPosts, makePost } from '@utils/posts';
import cors from 'cors';
import express from 'express';
import functions = require('firebase-functions');

// Express initialisation
const app = express();

// Cors initialisation
app.use(cors());

// GET endpoints
app.get('/posts', firebaseAuthorization, getAllPosts);
app.get('/users', firebaseAuthorization, getAllUsers);

// POST endpoints
app.post('/posts', firebaseAuthorization, makePost);

// Register / Signup users
app.post('/register', register);
// Login users
app.post('/login', login);

exports.api = functions.https.onRequest(app);
