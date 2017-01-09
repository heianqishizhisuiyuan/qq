/*var express = require('express');
var UserModel=require('./user_model').UserModel;
var ChatinfoModel=require('./user_model').ChatinfoSchema;



// 获取用户关联表的信息
var chatinfo = {};
ChatinfoModel.findOne({}, function(err, data) {
  if (err) throw err;
  chatinfo = data;
});

router.get('/', function(req, res, next) {
  console.log(req.query.currentname);//接受
  res.render('chat', {"users": chatinfo.users, 'currentname' : req.query.currentname});
});

module.exports = router;
*/