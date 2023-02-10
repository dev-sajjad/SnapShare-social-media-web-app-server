import express from 'express';

import {getPosts, createPost, updatePost, deletePost, likePost} from '../controllers/posts.js'
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.get('/', getPosts)
router.post('/', userAuth, createPost)
router.patch('/:id', userAuth, updatePost)
router.delete('/:id', userAuth, deletePost)

router.patch('/:id/likePost', userAuth, likePost);

export default router;