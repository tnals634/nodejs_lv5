const { posts, post_likes } = require('../models');
const { Op } = require('sequelize');

class PostRepository {
  findAllPost = async () => {
    const allPosts = await posts.findAll({
      include: [
        {
          model: users,
          attributes: ['user_id', 'nickname'],
        },
      ],
    });

    return allPosts;
  };

  createPost = async (user_id, nickname, title, content, likes) => {
    const createPostData = await posts.create({
      User_id: user_id,
      nickname,
      title,
      content,
      likes,
    });

    return createPostData;
  };

  findOnePost = async (post_id) => {
    const post = await posts.findOne({
      where: { post_id },
      include: [
        {
          model: users,
          attributes: ['user_id', 'nickname'],
        },
      ],
    });

    return post;
  };

  updatePost = async (user_id, post_id, title, content, likes) => {
    const updatePostData = await posts.update(
      { title, content, likes },
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

  createLike = async (post_id, user_id) => {
    const like = await post_likes.create({
      Post_id: post_id,
      User_id: user_id,
    });

    return like;
  };

  findAllLikePost = async () => {
    const likes = await posts.findAll({
      where: { likes: { [Op.gt]: 0 } },
      include: [
        {
          model: users,
          attributes: ['user_id', 'nickname'],
        },
      ],
    });

    return likes;
  };

  findAllLike = async (post_id) => {
    const likes = await post_likes.findAll({ where: { Post_id: post_id } });

    return likes;
  };

  findOneLike = async (post_id, user_id) => {
    const like = await post_likes.findOne({
      where: {
        [Op.and]: [{ Post_id: post_id }, { User_id: user_id }],
      },
    });

    return like;
  };

  deleteLike = async (post_id, user_id) => {
    const dLike = await post_likes.destroy({
      where: {
        [Op.and]: [{ Post_id: post_id }, { User_id: user_id }],
      },
    });

    return dLike;
  };
}

module.exports = PostRepository;
