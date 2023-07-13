const PostRepository = require('../repositories/posts.repository');
const UserRepository = require('../repositories/users.repository');

class PostService {
  postRepository = new PostRepository();
  userRepository = new UserRepository();

  createPost = async (user_id, title, content, likes) => {
    const user = await this.userRepository.findUserById(user_id);
    const error = new Error();
    if (!title || !content) {
      error.message = '데이터 형식이 올바르지 않습니다.';
      error.status = 400;
      throw error;
    } else if (typeof title != 'string') {
      error.message = '게시글 제목의 형식이 일치하지 않습니다.';
      error.status = 400;
      throw error;
    } else if (typeof content != 'string') {
      error.message = '게시글 내용의 형식이 일치하지 않습니다.';
      error.status = 400;
    }
    const post = await this.postRepository.createPost(
      user.user_id,
      user.nickname,
      title,
      content,
      likes
    );

    return {
      post_id: post.post_id,
      User_id: post.User_id,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  };

  findAllPost = async () => {
    const allPosts = await this.postRepository.findAllPost();

    allPosts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return allPosts.map((post) => {
      return {
        post_id: post.post_id,
        User_id: post.User_id,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  };

  findOnePost = async (post_id) => {
    const post = await this.postRepository.findOnePost(post_id);
    const error = new Error();
    if (!post) {
      error.message = '게시글이 존재하지 않습니다.';
      error.status = 404;
      throw error;
    }
    return {
      post_id: post.post_id,
      User_id: post.User_id,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      likes: post.likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  };

  updatePost = async (user_id, post_id, title, content) => {
    const post = await this.postRepository.findOnePost(post_id);
    const error = new Error();
    if (!post) {
      error.message = '게시글이 존재하지 않습니다.';
      error.status = 404;
      throw error;
    } else if (!title || !content) {
      error.message = '데이터 형식이 올바르지 않습니다.';
      error.status = 400;
      throw error;
    } else if (user_id != post.User_id) {
      error.message = '게시글 수정 권한이 존재하지 않습니다.';
      error.status = 403;
      throw error;
    } else if (typeof title != 'string') {
      error.message = '게시글 제목의 형식이 일치하지 않습니다.';
      error.status = 400;
      throw error;
    } else if (typeof content != 'string') {
      error.message = '게시글 내용의 형식이 일치하지 않습니다.';
      error.status = 400;
      throw error;
    }
    await this.postRepository.updatePost(
      user_id,
      post_id,
      title,
      content,
      post.likes
    );

    const updatePost = await this.postRepository.findOnePost(post_id);

    return {
      post_id: updatePost.post_id,
      User_id: updatePost.User_id,
      nickname: updatePost.nickname,
      title: updatePost.title,
      content: updatePost.content,
      likes: updatePost.likes,
      createdAt: updatePost.createdAt,
      updatedAt: updatePost.updatedAt,
    };
  };

  deletePost = async (post_id, user_id) => {
    const post = await this.postRepository.findOnePost(post_id);
    const error = new Error();
    if (!post) {
      error.message = '게시글이 존재하지 않습니다.';
      error.status = 404;
      throw error;
    } else if (user_id != post.User_id) {
      error.message = '게시글 삭제 권한이 존재하지 않습니다.';
      error.status = 403;
      throw error;
    }
    await this.postRepository.deletePost(post_id, user_id);

    return {
      post_id: post.post_id,
      User_id: post.User_id,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  };

  createLike = async (post_id, user_id) => {
    const post = await this.postRepository.findOnePost(post_id);
    const like = await this.postRepository.findOneLike(post_id, user_id);
    const error = new Error();

    let updateStatus = 0;
    let message = '';
    if (!post) {
      error.message = '게시글이 존재하지 않습니다.';
      error.status = 404;
      throw error;
    } else if (!like) {
      await this.postRepository.createLike(post_id, user_id);
      const post = await this.postRepository.findOnePost(post_id);
      const findAllLike = await this.postRepository.findAllLike(post_id);

      await this.postRepository.updatePost(
        post.User_id,
        post.post_id,
        post.title,
        post.content,
        findAllLike.length
      );

      return {
        updateStatus: 200,
        message: '좋아요를 등록하였습니다.',
      };
    }
    await this.postRepository.deleteLike(post_id, user_id);
    const findAllLike = await this.postRepository.findAllLike(post_id);

    await this.postRepository.updatePost(
      post.User_id,
      post.post_id,
      post.title,
      post.content,
      findAllLike.length
    );

    return {
      updateStatus: 200,
      message: '좋아요를 취소하였습니다.',
    };
  };

  findAllLikePost = async () => {
    const allLikePosts = await this.postRepository.findAllLikePost();

    allLikePosts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return allLikePosts.map((post) => {
      return {
        post_id: post.post_id,
        User_id: post.User_id,
        nickname: post.nickname,
        title: post.title,
        likes: post.likes,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  };
}

module.exports = PostService;
