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
}

module.exports = UserRepository;
