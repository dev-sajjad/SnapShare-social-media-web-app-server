import express from 'express';

import {getPostsBySearch,commentPost, getPost, getPosts, createPost, updatePost, deletePost, likePost} from '../controllers/posts.js'
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.get('/search', getPostsBySearch)
router.get('/', getPosts)
router.get('/:id', getPost)

router.post('/', userAuth, createPost)
router.patch('/:id', userAuth, updatePost)
router.delete('/:id', userAuth, deletePost)
router.patch('/:id/likePost', userAuth, likePost);
router.post('/:id/commentPost', userAuth, commentPost);

export default router;