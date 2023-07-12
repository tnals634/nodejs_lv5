const PostService = require('../services/posts.services');
const UserService = require('../services/users.services');
class PostsController {
  postService = new PostService();
  userService = new UserService();

  getPosts = async (req, res, next) => {
    const allPosts = await this.postService.findAllPost();

    res.status(200).json({ posts: allPosts });
  };

  getPostOne = async (req, res, next) => {
    const { post_id } = req.params;

    try {
      await this.postService.findOnePost(post_id);
    } catch (error) {
      return res
        .status(404)
        .json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }
    try {
      const post = await this.postService.findOnePost(post_id);

      res.status(200).json({ post: post });
    } catch (error) {
      return res
        .status(500)
        .json({ errorMessage: '게시글 상세 조회에 실패하였습니다.' });
    }
  };

  createPost = async (req, res, next) => {
    const { title, content } = req.body;
    const { user_id } = res.locals.user;

    try {
      const user = await this.userService.findUserById(user_id);
      if (!title || !content) {
        return res
          .status(400)
          .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
      } else if (typeof title != 'string') {
        return res
          .status(400)
          .json({ errorMessage: '게시글 제목의 형식이 일치하지 않습니다.' });
      } else if (typeof content != 'string') {
        return res
          .status(400)
          .json({ errorMessage: '게시글 내용의 형식이 일치하지 않습니다.' });
      }

      await this.postService.createPost(
        user.user_id,
        user.nickname,
        title,
        content
      );
      res.status(201).json({ message: '게시글 작성에 성공하였습니다.' });
    } catch (error) {
      return res
        .status(500)
        .json({ errorMessage: '게시글 작성에 실패하였습니다.' });
    }
  };

  updatePost = async (req, res, next) => {
    const { post_id } = req.params;
    const { title, content } = req.body;
    const { user_id } = res.locals.user;

    try {
      await this.postService.findOnePost(post_id);
    } catch (error) {
      return res
        .status(404)
        .json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }

    try {
      const post = await this.postService.findOnePost(post_id);
      if (!title || !content) {
        return res
          .status(400)
          .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
      } else if (user_id != post.User_id) {
        return res
          .status(403)
          .json({ errorMessage: '게시글 수정 권한이 존재하지 않습니다.' });
      } else if (typeof title != 'string') {
        return res
          .status(400)
          .json({ errorMessage: '게시글 제목의 형식이 일치하지 않습니다.' });
      } else if (typeof content != 'string') {
        return res
          .status(400)
          .json({ errorMessage: '게시글 내용의 형식이 일치하지 않습니다.' });
      }

      await this.postService.updatePost(
        user_id,
        post_id,
        title,
        content,
        post.likes
      );

      res.status(200).json({ message: '게시글을 수정하였습니다.' });
    } catch (error) {
      return res
        .status(500)
        .json({ errorMessage: '게시글 수정에 실패하였습니다.' });
    }
  };

  deletePost = async (req, res, next) => {
    const { post_id } = req.params;
    const { user_id } = res.locals.user;

    try {
      await this.postService.findOnePost(post_id);
    } catch (error) {
      return res
        .status(404)
        .json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }

    try {
      const post = await this.postService.findOnePost(post_id);
      if (user_id != post.User_id) {
        return res
          .status(403)
          .json({ errorMessage: '게시글 삭제 권한이 존재하지 않습니다.' });
      }

      await this.postService.deletePost(post_id, post.User_id);

      res.status(200).json({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
      return res
        .status(500)
        .json({ errorMessage: '게시글 삭제에 실패하였습니다.' });
    }
  };

  updatePostLike = async (req, res, next) => {
    const { post_id } = req.params;
    const { user_id } = res.locals.user;

    try {
      await this.postService.findOnePost(post_id);
    } catch (error) {
      return res
        .status(404)
        .json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }

    try {
      await this.postService.findOneLike(post_id, user_id);
    } catch (error) {
      await this.postService.createLike(post_id, user_id);
      const post = await this.postService.findOnePost(post_id);
      const findAllLike = await this.postService.findAllLike(post_id);

      await this.postService.updatePost(
        post.User_id,
        post.post_id,
        post.title,
        post.content,
        findAllLike.length
      );
      return res
        .status(200)
        .json({ message: `${post.title}의 좋아요를 등록하였습니다.` });
    }
    try {
      const post = await this.postService.findOnePost(post_id);
      await this.postService.deleteLike(post_id, user_id);
      const findAllLike = await this.postService.findAllLike(post_id);

      await this.postService.updatePost(
        post.User_id,
        post.post_id,
        post.title,
        post.content,
        findAllLike.length
      );
      res
        .status(200)
        .json({ message: `${post.title}의 좋아요를 취소하였습니다.` });
    } catch (like) {
      return res
        .status(500)
        .json({ errorMessage: '좋아요를 수정할 수 없습니다.' });
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
