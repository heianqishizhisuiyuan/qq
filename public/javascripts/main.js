$(function(){

var View={
	createWrapper : function(){
		var wrapper = $("<div class='wrapper_wrapper'></div>");		
		wrapper.appendTo(document.body);
		wrapper.delegate(".right-return_btn","click",function(){
			var hide = wrapper.addClass("wrapper_hide");
				setTimeout(function(){
					hide.remove();
				},500);
		});
		return wrapper;
	},
}

	var before_h=$(window).height() ;
	$(window).resize(function(){
		var now_h=$(window).height() ;
		$('.go_regist,.go_login').css('top',before_h-25)
		
	})
	$("#regist_btn").click(function(){
		var user_name=$("#user_name").val();
		var user_phone=$("#user_phone").val();
		var user_pwd=$("#user_pwd").val();
		var user_repwd=$("#user_repwd").val();
		if(!$.form.isEmpty(user_name)){
			$.tip('请输入用户名')
		}else if(!$.form.isEmpty(user_phone)){
			$.tip('请输入手机号')
		}else if(!$.form.isEmpty(user_pwd)){
			$.tip('请输入密码')
		}else if(!$.form.isEmpty(user_repwd)){
			$.tip('请再次输入密码')
		}else if(!$.form.hasBlank(user_name)||user_name.length<3){
			$.tip('请正确输入用户名')
		}else if(!$.form.isPhone(user_phone)){
			$.tip('请输入正确的手机号码')
		}else if(!$.form.isSame(user_pwd,user_repwd)){
			$.tip("两次输入的密码不一致")
		}else if(user_pwd.length<6){
			$.tip("密码过短！")
		}else{
			$.ajax({
			type:'post',
			url:'/regist_',
			data:{
				user_name:user_name,
				user_phone:user_phone,
				user_pwd:user_pwd
			},
			success:function(h){
				if(h.code==1){
					window.location.href='/'
				}
				if(h.code==-1){
					$(".tip").css('display','block').animate({'opacity':1},"slow",function(){
						$(".tip").animate({'opacity':'0'},'slow',function(){
							$(".tip").css('display','block')
							$(".regist input").val("");
							$("#user_name").focus();
						})
					});
				}
			}
		})
		}

	})
	$("#login_btn").click(function(){
		$.ajax({
			type:'post',
			url:'/login_',
			data:{
				user_phone:$("#user_phone").val(),
				user_pwd:$("#user_pwd").val()
			},
			success:function(h){
				if(h.code==-1){
					$(".tip").css('display','block').animate({'opacity':1},"slow",function(){
						$(".tip").animate({'opacity':'0'},'slow',function(){
							$(".tip").css('display','block')
							$(".login input").val("");
							$("#user_phone").focus();
						})
					});
				}else if(h.code==1){
					window.location.href='/home';
				}
			}
		})
	})
	$(".right-return").click(function(){
		window.location.href='/';
	})

	/*home*/
	$(".home_title div").click(function(){
		$(".home_title div").removeClass("home_title_class");
		$(this).addClass('home_title_class');
	})


	$(".message-ul li").click(function(){
		var to =$(this).attr('to');
		var from_ =$(this).attr('from');
		$.ajax({
			type:'post',
			url:'/chat_window',
			data:{
				to:to,
				from_:from_
			},
			success:function(h){
	            var wrapper = View.createWrapper();
				wrapper.html(h);
					var socket = io().connect('localhost');
				//发送消息	
				$("#btn_msg_send").click(function(){
					var to=$(this).attr('to');
					var from =$(this).attr('from');
					var msg=$("#msg_conntent").val();
					if(from && to && $.trim(msg)){
					    socket.emit('chat message', from, to, msg);
				        var message = from + " " + new Date().toLocaleString() + "\n" + msg + "\n";
				        $("#msg_conntent").val('');
				        var chat_content="<div class='clearfix chat-content-wrap'><div class='chat-header fr'>"
						+"<img src='/images/header.jpg'></div><div class='cx_org_box' style='width: 70%;margin-left:15%; text-align:right;'><div class='chat-content' id='me-chat-content'style='text-align: right; background-color:#B0E0E6;'>"+msg+"</div><span class='cx_org_cor02'></span></div></div>"
						$("#chat-list").append(chat_content);
						$('#chat-list-wrap').scrollTop( $('#chat-list-wrap')[0].scrollHeight );	
					}
				});
				//接收消息
				socket.on(from_ + '_message', function(from, msg, time) {
					console.log(msg)
				   // var message = from + "  " + new Date(time).toLocaleString() + "\n" + msg + '\n';
				    var chat_content="<div class='clearfix chat-content-wrap'><div class='chat-header fl'>"
					+"<img src='/images/header.jpg'></div><div class='cx_org_box'><div class='chat-content'>"+msg+"</div><span class='cx_org_cor'></span></div></div>"
					$("#chat-list").append(chat_content);
				    //updateMsgForm(message);
					$('#chat-list-wrap').scrollTop( $('#chat-list-wrap')[0].scrollHeight );
				});
				var beforeh=$(window).height();
				$(window).resize(function(){
					var chatListh=$("#chat-list").height();
				
					var nowh=$(window).height() ;
					$('#chat-list-wrap').css('padding-bottom',beforeh-nowh-chatListh+50);
					$('#chat-list-wrap').scrollTop( $('#chat-list-wrap')[0].scrollHeight );	
				})

			}
		})
	})


})
