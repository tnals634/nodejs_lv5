const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');

const CommentController = require('../controllers/comments.controller');
const commentsController = new CommentController();

router.post(
  '/posts/:post_id/comments',
  authMiddleWare,
  commentsController.postComment
);
router.get('/posts/:post_id/comments', commentsController.getComments);
router.put(
  '/posts/:post_id/comments/:comment_id',
  authMiddleWare,
  commentsController.putComment
);
router.delete(
  '/posts/:post_id/comments/:comment_id',
  authMiddleWare,
  commentsController.deleteComment
);

module.exports = router;
