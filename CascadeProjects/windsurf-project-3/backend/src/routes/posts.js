const express = require('express');
const {
  createPost,
  getPosts,
  getPost,
  likePost,
  commentOnPost,
  deletePost
} = require('../controllers/postController');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createPost);
router.get('/', optionalAuth, getPosts);
router.get('/:id', optionalAuth, getPost);
router.post('/:id/like', auth, likePost);
router.post('/:id/comment', auth, commentOnPost);
router.delete('/:id', auth, deletePost);

module.exports = router;
