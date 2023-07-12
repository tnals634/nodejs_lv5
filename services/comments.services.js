const CommentRepository = require('../repositories/posts.repository');
const PostRepository = require('../repositories/posts.repository');
const UserRepository = require('../repositories/users.repository');

class CommentService {
  commentRepository = new CommentRepository();
  postRepository = new PostRepository();
  userRepository = new UserRepository();

  createComment = async (user_id, post_id, comment) => {
    const user = await this.userRepository.findUserById(user_id);
    const post = await this.postRepository.findOnePost(post_id);
    const error = new Error();
    if (!post) {
      error.message = '게시글을 찾을 수 없습니다.';
      error.status = 404;
      throw error;
    } else if (!comment) {
      error.message = '댓글을 입력해주세요.';
      error.status = 400;
      throw error;
    } else if (typeof comment != 'string') {
      error.message = '댓글 형식이 일치하지 않습니다.';
      error.status = 400;
      throw error;
    }

    const createComment = await this.commentRepository.createComment(
      user.user_id,
      post.post_id,
      user.nickname,
      comment
    );

    return createComment;
  };

  findComments = async (post_id) => {
    const post = await this.postRepository.findOnePost(post_id);
    const error = new Error();
    if (!post) {
      error.message = '게시글을 찾을 수 없습니다.';
      error.status = 404;
      throw error;
    }
    const findComments = await this.commentRepository.findComments(post_id);

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

  updateComment = async (user_id, post_id, comment_id, comment) => {
    const post = await this.postRepository.findOnePost(post_id);
    const error = new Error();
    if (!post) {
      error.message = '게시글을 찾을 수 없습니다.';
      error.status = 404;
      throw error;
    }
    const findComment = await this.commentRepository.findCommentById(
      comment_id
    );
    if (!findComment) {
      error.message = '댓글을 찾을 수 없습니다.';
      error.status = 404;
      throw error;
    } else if (!comment) {
      error.message = '댓글을 작성해주세요';
      error.status = 400;
      throw error;
    } else if (typeof comment != 'string') {
      error.message = '댓글 형식이 일치하지 않습니다.';
      error.status = 400;
      throw error;
    } else if (user_id != findComment.user_id) {
      error.message = '댓글의 수정 권한이 존재하지 않습니다.';
      error.status = 403;
      throw error;
    }

    const updateComment = await this.commentRepository.updateComment(
      user_id,
      post_id,
      comment_id,
      comment
    );

    return {
      comment_id: updateComment.comment_id,
      User_id: updateComment.User_id,
      Post_id: updateComment.Post_id,
      nickname: updateComment.nickname,
      comment: updateComment.comment,
      createdAt: updateComment.createdAt,
      updatedAt: updateComment.updatedAt,
    };
  };

  deleteComment = async (user_id, post_id, comment_id) => {
    const post = await this.postRepository.findOnePost(post_id);
    const error = new Error();
    if (!post) {
      error.message = '게시글을 찾을 수 없습니다.';
      error.status = 404;
      throw error;
    }
    const comment = await this.commentRepository.findCommentById(comment_id);
    if (!comment) {
      error.message = '댓글을 찾을 수 없습니다.';
      error.status = 404;
      throw error;
    } else if (user_id != comment.User_id) {
      error.message = '댓글 삭제 권한이 존재하지 않습니다.';
      error.status = 403;
      throw error;
    }

    const deleteComment = await this.commentRepository.deletePost(
      user_id,
      post_id,
      comment_id
    );

    return {
      comment_id: deleteComment.comment_id,
      Post_id: deleteComment.Post_id,
      User_id: deleteComment.User_id,
      nickname: deleteComment.nickname,
      comment: deleteComment.comment,
      createdAt: deleteComment.createdAt,
      updatedAt: deleteComment.updatedAt,
    };
  };
}

module.exports = CommentService;
