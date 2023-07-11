const UserRepository = require('../repositories/users.repository');

class UserService {
  userRepository = new UserRepository();

  findUser = async (nickname) => {
    const findUser = await this.userRepository.findUser(nickname);

    return {
      user_id: findUser.user_id,
      nickname: findUser.nickname,
      password: findUser.password,
    };
  };

  createUser = async (nickname, password) => {
    const createUserData = await this.userRepository.createUser(
      nickname,
      password
    );

    return createUserData;
  };
}

module.exports = UserService;
