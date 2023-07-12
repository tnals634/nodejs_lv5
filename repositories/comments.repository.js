const { comments } = require('../models');
const { Op } = require('sequelize');
class CommentRepository {
  findAllComment = async (post_id) => {
    const allPostComments = await comments.findAll({
      where: { Post_id: post_id },
    });

    return allPostComments;
  };

  findCommentById = async (comment_id) => {
    const comment = await comments.findOne({ where: { comment_id } });

    return comment;
  };

  createComment = async (user_id, post_id, nickname, comment) => {
    const createCommentData = await comments.create({
      Post_id: post_id,
      User_id: user_id,
      nickname,
      comment,
    });

    return createCommentData;
  };

  updateComment = async (user_id, post_id, comment_id, comment) => {
    const updateCommentData = await comments.update(
      { comment },
      {
        where: {
          [Op.and]: [
            { comment_id },
            { User_id: user_id },
            { Post_id: post_id },
          ],
        },
      }
    );

    return updateCommentData;
  };

  deleteComment = async (user_id, post_id, comment_id) => {
    const deleteCommentData = await comments.destroy({
      where: {
        [Op.and]: [{ Post_id: post_id }, { User_id: user_id }, { comment_id }],
      },
    });

    return deleteCommentData;
  };
}

module.exports = CommentRepository;
