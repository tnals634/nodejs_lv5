const UserRepository = require('../repositories/users.repository');

class UserService {
  userRepository = new UserRepository();

  findUserById = async (user_id) => {
    const user = await this.userRepository.findUserById(user_id);

    return user;
  };

  loginUser = async (nickname, password) => {
    const findUser = await this.userRepository.findUser(nickname);
    const error = new Error();
    if (!findUser || findUser.password !== password) {
      error.message = '닉네임 또는 패스워드를 확인해주세요.';
      error.status = 412;
      throw error;
    }
    return {
      user_id: findUser.user_id,
      nickname: findUser.nickname,
      password: findUser.password,
    };
  };

  signupUser = async (nickname, password, confirmPassword) => {
    //데이터 형식이 맞는지 검사
    const scriptTag = /[~!@#\$%\^&\*\(\)_\+\-={}\[\];:<>,\.\/\?\"\'\/\|\\]/; // 특수문자들
    const validationNickname = /^([a-z]|[A-Z]|[0-9]).{3,20}$/;
    const validationPassword = /^([a-zA-Z]|[0-9]|[!@#$%^*+=-]).{3,20}$/;
    const findUser = await this.userRepository.findUser(nickname);

    const error = new Error();
    //작성한 닉네임이 이미 존재할 경우
    if (findUser) {
      error.message = '중복되는 닉네임입니다.';
      error.status = 409;
      throw error;
    }
    //body값에서 하나라도 작성을 안한 경우
    if (!nickname || !password || !confirmPassword) {
      error.message = '닉네임,비밀번호, 비밀번호 확인을 확인해주세요.';
      error.status = 400;
      throw error;
    }

    // 닉네임의 형식이 안맞거나 특수문자가 있는 경우
    else if (
      typeof nickname != 'string' ||
      validationNickname.test(nickname) === false ||
      scriptTag.test(nickname === true)
    ) {
      error.message = '닉네임 형식이 일치하지 않습니다.';
      error.status = 400;
      throw error;
    }

    // 비밀번호 형식이 안맞을 경우
    else if (
      typeof password != 'string' ||
      validationPassword.test(password) === false
    ) {
      error.message = '비밀번호 형식이 일치하지 않습니다.';
      error.status = 400;
      throw error;
    }

    //작성한 비밀번호와 비밀번호 확인이 일치하지 않을경우
    else if (password != confirmPassword) {
      error.message = '패스워드가 일치하지 않습니다.';
      error.status = 412;
      throw error;
    }
    const createUserData = await this.userRepository.createUser(
      nickname,
      password
    );

    return createUserData;
  };
}

module.exports = UserService;
