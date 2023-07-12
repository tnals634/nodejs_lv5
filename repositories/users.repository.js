const { users } = require('../models');

class UserRepository {
  createUser = async (nickname, password) => {
    const createUser = await users.create({ nickname, password });

    return createUser;
  };

  findUser = async (nickname) => {
    const user = await users.findOne({ where: { nickname: nickname } });

    return user;
  };

  findUserById = async (user_id) => {
    const findUser = await users.findOne({ where: { user_id } });

    return findUser;
  };
}

module.exports = UserRepository;
