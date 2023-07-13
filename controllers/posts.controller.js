const PostService = require('../services/posts.services');

class PostsController {
  postService = new PostService();

  getPosts = async (req, res, next) => {
    const allPosts = await this.postService.findAllPost();

    res.status(200).json({ posts: allPosts });
  };

  getPostOne = async (req, res, next) => {
    const { post_id } = req.params;

    try {
      const post = await this.postService.findOnePost(post_id);

      res.status(200).json({ post: post });
    } catch (error) {
      return res.status(error.status).json({ errorMessage: error.message });
    }
  };

  createPost = async (req, res, next) => {
    const { title, content } = req.body;
    const { user_id } = res.locals.user;

    try {
      await this.postService.createPost(user_id, title, content, 0);
      res.status(201).json({ message: '게시글 작성에 성공하였습니다.' });
    } catch (error) {
      return res.status(error.status).json({ errorMessage: error.message });
    }
  };

  updatePost = async (req, res, next) => {
    const { post_id } = req.params;
    const { title, content } = req.body;
    const { user_id } = res.locals.user;

    try {
      await this.postService.updatePost(user_id, post_id, title, content);

      res.status(200).json({ message: '게시글을 수정하였습니다.' });
    } catch (error) {
      return res.status(error.status).json({ errorMessage: error.message });
    }
  };

  deletePost = async (req, res, next) => {
    const { post_id } = req.params;
    const { user_id } = res.locals.user;

    try {
      await this.postService.deletePost(post_id, user_id);

      res.status(200).json({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
      return res.status(error.status).json({ errorMessage: error.message });
    }
  };

  updatePostLike = async (req, res, next) => {
    const { post_id } = req.params;
    const { user_id } = res.locals.user;

    try {
      const update = await this.postService.createLike(post_id, user_id);
      return res.status(update.updateStatus).json({ message: update.message });
    } catch (error) {
      return res.status(error).json({ errorMessage: error.message });
    }
  };

  findAllLikePost = async (req, res, next) => {
    try {
      const findAllLike = await this.postService.findAllLikePost();

      res.json({ posts: findAllLike });
    } catch (error) {
      return res
        .status(500)
        .json({ errorMessage: '좋아요 게시글 조회에 실패하였습니다.' });
    }
  };
}

module.exports = PostsController;
