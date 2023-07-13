const UserService = require('../services/users.services');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const env = process.env;

class UsersController {
  userService = new UserService();

  getUser = async (req, res, next) => {
    const { nickname, password } = req.body;

    try {
      const loginUser = await this.userService.loginUser(nickname, password);

      const token = jwt.sign(
        {
          user_id: loginUser.user_id,
        },
        env.JWT_SECRET_KEY
      );
      res.cookie('authorization', `Bearer ${token}`);
      res.status(200).json({ message: '로그인에 성공하였습니다.' });
    } catch (error) {
      return res.status(error.status).json({ errorMessage: error.message });
    }
  };

  createUser = async (req, res, next) => {
    const { nickname, password, confirmPassword } = req.body;

    try {
      await this.userService.signupUser(nickname, password, confirmPassword);

      res.status(201).json({ message: '회원가입에 성공하였습니다.' });
    } catch (error) {
      return res.status(error.status).json({ errorMessage: error.message });
    }
  };
}

module.exports = UsersController;
