const express = require('express');
const { createPost, getPost } = require('../controllers/postController');
const router = express.Router();

// Route to create a new post
router.post('/create', createPost);

// Route to get a post by post ID
router.get('/:postId', getPost);

module.exports = router;
