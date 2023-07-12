const PostRepository = require('../repositories/posts.repository');
const UserRepository = require('../repositories/users.repository');
class PostService {
  postRepository = new PostRepository();
  userRepository = new UserRepository();

  createPost = async (user_id, nickname, title, content) => {
    const post = await this.postRepository.createPost(
      user_id,
      nickname,
      title,
      content
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

  updatePost = async (user_id, post_id, title, content) => {
    const findPost = await this.postRepository.findOnePost(post_id);
    if (!findPost) throw new Error("Post doesn't exist");

    await this.postRepository.updatePost(user_id, post_id, title, content);

    const updatePost = await this.postRepository.findOnePost(post_id);

    return {
      post_id: updatePost.post_id,
      User_id: updatePost.User_id,
      nickname: updatePost.nickname,
      title: updatePost.title,
      content: updatePost.content,
      createdAt: updatePost.createdAt,
      updatedAt: updatePost.updatedAt,
    };
  };

  deletePost = async (post_id, user_id) => {
    const findPost = await this.postRepository.findOnePost(post_id);
    if (!findPost) throw new Error("Post doesn't exist");

    await this.postRepository.deletePost(post_id, user_id);

    return {
      post_id: findPost.post_id,
      User_id: findPost.User_id,
      nickname: findPost.nickname,
      title: findPost.title,
      content: findPost.content,
      createdAt: findPost.createdAt,
      updatedAt: findPost.updatedAt,
    };
  };

  findOneUser = async (user_id) => {
    const user = await this.userRepository.findUserById(user_id);

    return user;
  };
}

module.exports = PostService;
