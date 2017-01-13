var mongoose = require("mongoose");


var UserSchema= mongoose.Schema({
  username: String,
  nickname: String,
  password: String,
  status: String
});


var ChatinfoSchema =new mongoose.Schema({
  users: Array,
  mapusers: Array
});


var UserModel=mongoose.model('users',UserSchema);
var ChatinfoSchema=mongoose.model('chatinfos',ChatinfoSchema);



exports.UserModel= UserModel;
exports.ChatinfoSchema= ChatinfoSchema;

