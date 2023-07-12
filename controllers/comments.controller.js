const CommentService = require('../services/comments.services');
const PostService = require('../services/posts.services');
const UserService = require('../services/users.services');
class CommentController {
  commentService = new CommentService();
  postService = new PostService();
  userService = new UserService();

  postComment = async (req, res, next) => {
    const { post_id } = req.params;
    const { user_id } = res.locals.user;
    const { comment } = req.body;

    try {
      await this.postService.findOnePost(post_id);
    } catch (error) {
      return res
        .status(404)
        .json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }
    try {
      const user = await this.userService.findUserById(user_id);
      const post = await this.postService.findOnePost(post_id);
      if (!comment) {
        return res.status(400).json({ errorMessage: '댓글을 입력해주세요.' });
      } else if (typeof comment != 'string') {
        return res
          .status(400)
          .json({ errorMessage: '댓글 형식이 일치하지 않습니다.' });
      }
      await this.commentService.createOneComment(
        user.user_id,
        post.post_id,
        user.nickname,
        comment
      );

      res.status(201).json({ message: '댓글 작성에 성공하였습니다.' });
    } catch (error) {
      return res
        .status(500)
        .json({ errorMessage: '댓글 작성에 실패하였습니다.' });
    }
  };

  getComments = async (req, res, next) => {
    const { post_id } = req.params;
    try {
      await this.postService.findOnePost(post_id);
    } catch (error) {
      return res
        .status(404)
        .json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }
    try {
      const comments = await this.commentService.findComments(post_id);

      res.status(200).json({ comments: comments });
    } catch (error) {
      return res
        .status(500)
        .json({ errorMessage: '댓글 조회에 실패하였습니다.' });
    }
  };

  putComment = async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    const { user_id } = res.locals.user;
    const { comment } = req.body;

    try {
      await this.postService.findOnePost(post_id);
    } catch (error) {
      return res
        .status(404)
        .json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }

    try {
      const findComment = await this.commentService.findCommentById(comment_id);
      if (!findComment) {
        return res
          .status(404)
          .json({ errorMessage: '댓글을 찾을 수 없습니다.' });
      } else if (!comment) {
        return res.status(400).json({ errorMessage: '댓글을 작성해주세요.' });
      } else if (typeof comment != 'string') {
        return res
          .status(400)
          .json({ errorMessage: '댓글 형식이 일치하지 않습니다.' });
      } else if (user_id != findComment.User_id) {
        return res
          .status(403)
          .json({ errorMessage: '댓글 수정 권한이 존재하지 않습니다.' });
      }
      await this.commentService.updateOneComment(
        user_id,
        post_id,
        comment_id,
        comment
      );
      res.status(200).json({ message: '댓글을 수정하였습니다.' });
    } catch (error) {
      return res
        .status(500)
        .json({ errorMessage: '댓글 수정에 실패하였습니다.' });
    }
  };

  deleteComment = async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    const { user_id } = res.locals.user;

    try {
      await this.postService.findOnePost(post_id);
    } catch (error) {
      return res
        .status(404)
        .json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }

    try {
      const comment = await this.commentService.findCommentById(comment_id);
      if (!comment) {
        return res
          .status(404)
          .json({ errorMessage: '댓글이 존재하지 않습니다.' });
      } else if (user_id != comment.User_id) {
        return res
          .status(403)
          .json({ errorMessage: '댓글 삭제 권한이 존재하지 않습니다.' });
      }
      await this.commentService.deleteComment(user_id, post_id, comment_id);
      res.status(200).json({ message: '댓글을 삭제하였습니다.' });
    } catch (error) {
      return res
        .status(500)
        .json({ errorMessage: '댓글 삭제에 실패하였습니다.' });
    }
  };
}

module.exports = CommentController;
