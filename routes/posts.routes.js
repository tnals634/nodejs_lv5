const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

router.post('/posts', authMiddleWare, postsController.createPost);
router.get('/posts', postsController.getPosts);
router.get('/posts/:post_id', postsController.getPostOne);
router.put('/posts/:post_id', authMiddleWare, postsController.updatePost);
router.delete('/posts/:post_id', authMiddleWare, postsController.deletePost);
router.put(
  '/posts/:post_id/like',
  authMiddleWare,
  postsController.updatePostLike
);
router.get('/like/posts', authMiddleWare, postsController.findAllLikePost);

module.exports = router;
