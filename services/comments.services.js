const CommentRepository = require('../repositories/comments.repository');

class CommentService {
  commentRepository = new CommentRepository();

  createOneComment = async (user_id, post_id, nickname, comment) => {
    const createCommentData = await this.commentRepository.createComment(
      user_id,
      post_id,
      nickname,
      comment
    );

    return {
      comment_id: createCommentData.comment_id,
      User_id: createCommentData.User_id,
      Post_id: createCommentData.Post_id,
      nickname: createCommentData.nickname,
      comment: createCommentData.comment,
      createdAt: createCommentData.createdAt,
      updatedAt: createCommentData.updatedAt,
    };
  };

  findComments = async (post_id) => {
    const findComments = await this.commentRepository.findAllComment(post_id);

    findComments.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return findComments.map((comment) => {
      return {
        comment_id: comment.comment_id,
        User_id: comment.User_id,
        nickname: comment.nickname,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    });
  };

  findCommentById = async (comment_id) => {
    const comment = await this.commentRepository.findCommentById(comment_id);

    return comment;
  };

  updateOneComment = async (user_id, post_id, comment_id, comment) => {
    const findComment = await this.commentRepository.findCommentById(
      comment_id
    );
    if (!findComment) throw new Error("Comment doesn't exist");

    await this.commentRepository.updateComment(
      user_id,
      post_id,
      comment_id,
      comment
    );

    const updateComment = await this.commentRepository.findCommentById(
      comment_id
    );

    return {
      comment_id: updateComment.comment_id,
      Post_id: updateComment.Post_id,
      User_id: updateComment.User_id,
      nickname: updateComment.nickname,
      comment: updateComment.comment,
      createdAt: updateComment.createdAt,
      updatedAt: updateComment.updatedAt,
    };
  };

  deleteComment = async (user_id, post_id, comment_id) => {
    const findComment = await this.commentRepository.findCommentById(
      comment_id
    );
    if (!findComment) throw new Error("comment doesn't exist");

    await this.commentRepository.deleteComment(user_id, post_id, comment_id);

    return {
      Post_id: findComment.Post_id,
      User_id: findComment.User_id,
      nickname: findComment.nickname,
      comment: findComment.comment,
      createdAt: findComment.createdAt,
      updatedAt: findComment.updatedAt,
    };
  };
}

module.exports = CommentService;
