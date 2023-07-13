const CommentService = require('../services/comments.services');

class CommentController {
  commentService = new CommentService();

  postComment = async (req, res, next) => {
    const { post_id } = req.params;
    const { user_id } = res.locals.user;
    const { comment } = req.body;

    try {
      await this.commentService.createComment(user_id, post_id, comment);

      res.status(201).json({ message: '댓글 작성에 성공하였습니다.' });
    } catch (error) {
      return res.status(error.status).json({ errorMessage: error.message });
    }
  };

  getComments = async (req, res, next) => {
    const { post_id } = req.params;
    try {
      const comments = await this.commentService.findAllComment(post_id);

      res.status(200).json({ comments: comments });
    } catch (error) {
      return res.status(error.status).json({ errorMessage: error.message });
    }
  };

  putComment = async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    const { user_id } = res.locals.user;
    const { comment } = req.body;

    try {
      const test = await this.commentService.updateComment(
        user_id,
        post_id,
        comment_id,
        comment
      );

      res.status(200).json({ message: '댓글을 수정하였습니다.' });
    } catch (error) {
      return res.status(error.status).json({ errorMessage: error.message });
    }
  };

  deleteComment = async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    const { user_id } = res.locals.user;

    try {
      await this.commentService.deleteComment(user_id, post_id, comment_id);
      res.status(200).json({ message: '댓글을 삭제하였습니다.' });
    } catch (error) {
      return res.status(error.status).json({ errorMessage: error.message });
    }
  };
}

module.exports = CommentController;
