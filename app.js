const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3010;

const userRouter = require('./routes/users.routes');
const postRouter = require('./routes/posts.routes');
const commentRouter = require('./routes/comments.routes');
app.use(express.json());
app.use(cookieParser());

app.use('/', [userRouter, postRouter, commentRouter]);
app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸습니다.');
});
