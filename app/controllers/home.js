const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
// Article = mongoose.model('Article');

module.exports = function (app) {
  app.use('/', router);
};

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(8080);

io.on('connection', function (socket) {
  console.log('连接成功');
  //emit something
  emitUserList(socket);

  //for login
  socket.on('userLogin', function (data) {
    console.log(typeof data);
    User.find(data,(err,res) => {
      if(res.length > 0){
        console.log('已存在');
        console.log(res);

        User.update(res[0],{status: 'online'},(err,_res) =>{
          console.log(_res);
          emitUserList(socket);
        })
        return;
      } 
      const newUser = new User(data);
      newUser.save((err, saved) => {
        if (err) {
          console.error('addUserERR:' + err);
        }
        // console.log(saved);
        console.log('saved');
        emitUserList(socket);
        return saved;
      });
    })
  });

  //for login out
  socket.on('userLoginOut', function (data) {
    console.log('登出');
    console.log(data);
    User.find(data,(err,user) => {
      console.log('user');
      console.log(user);

      User.update(user[0],{status: 'offline'},(err,res) => {
        console.log(res);
        emitUserList(socket);
      })
    })
  });
});

function emitUserList(socket){
  User.find({}).exec((err,res) => {
    if(err) {
      console.error('查找错误');
      return;
    }
    if(res.length > 0){
      console.log('$$$$$$');
      console.log('有用户');
      socket.broadcast.emit('getUserList', res);
      socket.emit('getUserList', res);
      return;
    }
    socket.broadcast.emit('getUserList', {});
    console.log('没用户');
  })
}