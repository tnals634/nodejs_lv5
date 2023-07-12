const { posts } = require('../models');
const { Op } = require('sequelize');

class PostRepository {
  findAllPost = async () => {
    const allPosts = await posts.findAll();

    return allPosts;
  };

  createPost = async (user_id, nickname, title, content) => {
    const createPostData = await posts.create({
      User_id: user_id,
      nickname,
      title,
      content,
    });

    return createPostData;
  };

  findOnePost = async (post_id) => {
    const post = await posts.findOne({ where: { post_id } });

    return post;
  };

  updatePost = async (user_id, post_id, title, content) => {
    const updatePostData = await posts.update(
      { title, content },
      {
        where: {
          [Op.and]: [{ post_id }, { User_id: user_id }],
        },
      }
    );

    return updatePostData;
  };

  deletePost = async (post_id, user_id) => {
    const deletePostData = await posts.destroy({
      where: { [Op.and]: [{ post_id }, { User_id: user_id }] },
    });

    return deletePostData;
  };
}

module.exports = PostRepository;
