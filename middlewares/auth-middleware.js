const jwt = require('jsonwebtoken');
const { users } = require('../models');
require('dotenv').config();
const env = process.env;

module.exports = async (req, res, next) => {
  const { authorization } = req.cookies;
  const [tokenType, token] = (authorization ?? '').split(' ');
  if (tokenType !== 'Bearer' || !token) {
    return res.status(403).json({
      errorMessage: '로그인이 필요한 기능입니다.',
    });
  }

  try {
    const decodedToken = jwt.verify(token, env.JWT_SECRET_KEY);
    const user_id = decodedToken.user_id;

    const user = await users.findOne({ where: { user_id } });

    if (!user) {
      return res
        .status(403)
        .json({ errorMessage: '로그인이 필요한 기능입니다.' });
    }

    res.locals.user = user;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.' });
  }
};
