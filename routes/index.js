var express = require('express');
var router = express.Router();
var UserModel=require('./user_model').UserModel;
var ChatinfoModel=require('./user_model').ChatinfoSchema;


var chatinfo = {};





/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
router.get('/regist', function(req, res) {
  res.render('regist.html');
});



router.get('/personal-info', function(req, res) {
  res.render('personal-info.html');
});
router.get('/home', function(req, res, next) {
	var loginuser=req.session['loginuser'];
	if(loginuser){
		ChatinfoModel.findOne({}, function(err, data) {
	  		if (err) throw err;
	  	res.render('home.html',{
				loginuser:loginuser,
				list:data.users||[]
			})

		});
	}else{
		res.render('index');
	}
});
/*清除所有用户,慎用！！！*/
router.get('/userRemove_',function(req,res){
	UserModel.remove({},function(err){
		if(err){
			console.log(err)
		}
		ChatinfoModel.remove({},function(){
			res.render('userRemove.html');
		})
			

		
	})
	
})
//用户注册
router.post('/regist_',function(req,res){
	var user_name=req.body['user_name'];
	var user_pwd=req.body['user_pwd'];
	var user_phone=req.body['user_phone'];
	var userModel=new UserModel({
		username: user_phone,
 		nickname: user_name,
  		password: user_pwd
 
	})
	UserModel.findOne({username:user_phone},function(err,user1){
		if(user1){
			res.json({
				message:'该用户已经被注册！',
				code:-1
			})
		}else{
			userModel.save(function(err){
				if(err){
					console.log(err)
				}
				updateChatinfo(user_phone);
				res.json({
					message:'成功',
					code:1
				})
			})
		}
	})
})
// 用户登录
router.post('/login_',function(req,res){
	var user_phone=req.body['user_phone'];
	var user_pwd=req.body['user_pwd'];

	UserModel.findOne({username:user_phone},function(err,user){
		if(user){
			if(user.password==user_pwd){
				req.session["loginuser"]=user.toJSON();
				res.json({
					code:1,
				});
			}else{
				res.json({
					code:-1
				})
			}
		}else{
			res.json({
				code:-1,
			})
		}
	})
})
//更新chatinfo信息
function updateChatinfo(username) {
  ChatinfoModel.findOne({}, function(err, data) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(11111111)
    var users = [username],
        mapusers = [];
    if (data && data.users) {users = data.users;}
    if (data && data.mapusers){mapusers = data.mapusers;} 

    if (data && data.users) {
      for (var oneuser of users) {
        mapusers.push(oneuser + '_' + username);
      }
      users.push(username);
    }

    ChatinfoModel.remove({}, function(err, data) {
      if (err) throw err;
      var chatinfo = new ChatinfoModel();
      chatinfo.users = users;
      chatinfo.mapusers = mapusers;
      chatinfo.save(function(err) {
        if (err) throw err;
      });
    });
  });
};
/*聊天对话框*/
router.post('/chat_window', function(req, res) {
	var to=req.body['to'];
	var from_=req.body['from_'];
	console.log(to)
 	res.render('chat-window.html',{
	  	to:to,
	  	from:from_,
	  	title:'聊天对话框'
  	});
});

module.exports = router;

