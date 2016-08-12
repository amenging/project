$(function(){
		if($('.reg_div').text() != ''){
			// function
			var errorTip = '<div id="errorTip" class="alert alert-warning">{0}</div> ';
			var reg = /[a-zA-Z0-9_]{2,6}/,
				reg1 = /^[a-zA-Z]\w{5,16}$/;
			$(".reg_div").submit(function(){
				if(reg.test($('.name').val()) == false) {
					$(".message").html(errorTip.format('请输入正确的昵称'));
				}else	if(reg1.test($('.password').val()) == false) {
					$(".message").html(errorTip.format('请输入正确的密码'));
				}else if($('.password').val() != $('.repass').val()) {
					$(".message").html(errorTip.format('两次输入的密码不一致'));
				}
		    if(reg.test($('.name').val()) == true &&
		     reg1.test($('.password').val()) == true && 
		     $('.password').val() == $('.repass').val()){
	        return true;
		    }else{  
	        return false;
		    }  
			}); 
		}
	//===========在album页面执行==========================
		if($('.img_pre').text() != ''){
			$(function(){
				$('#fulAvatar').on("change", function(evt) { //图片预览
				 	for (var i = 0, numFiles = this.files.length; i < numFiles; i++) {
					 	var file = this.files[i];
						var reader = new FileReader();
						reader.onload = function(evt) {
							var img = "<img class='img img-thumbnail' src='" + evt.target.result + "'>";
							$('#out').append(img);
						};
						reader.readAsDataURL(file);
				 	}
				});
				$(".addPdiv").click(function(){ //添加图片按钮
					$(".img_pre, .upload").removeClass('hide');
				})
				$('#btnSub').on('click',function(){ //图片上传
					var fulAvatarVal = $('#fulAvatar').val(), 
						errorTip = '<div id="errorTip" class="alert alert-warning">{0}</div> ';
					$("#errorTip,#alt_warning").remove();
					if(fulAvatarVal.length == 0){
						$("#container").prepend(errorTip.format('请选择要上传的文件'));
						return false;
					}
					var extName = fulAvatarVal.substring(fulAvatarVal.lastIndexOf('.'),fulAvatarVal.length).toLowerCase();
					if(extName != '.png' && extName != '.jpg' && extName != '.jpeg'){
						 $("#container").prepend(errorTip.format('只支持png和jpg格式图片'));
						 return false;
					}
					return true;
				})
			});
		}
	//===========在talking页面执行==========================
		if($('.talking .panel-heading').text() != ''){
			var socket = io.connect({'log level': 2,'pingTimeout':300000,'pingInterval':1000});
			socket.on('connect',function(){
				if($('.username').text().replace(/\s+/,'') != ''){
					var username = $('.username').text();
					socket.emit('get_userList',username);
					}
			});
			socket.on('logout',function(users){ //哟怒下线时更新列表
				addUserList(users);
			});
			socket.on('post_userList',function(event){ //用户名列表
				addUserList(event);
			});
			socket.on('newMsg',function(msg, username){ //接收消息
				$('.msg-list-body').append("<li class='col-sm-12 col-xs-12'><div class='user'>"+
				username + ":</div><div class='msg all_msg'><div class='left'></div>" + msg + "</li>");
				window_scroll();
			});
			load_emoji();  //加入表情
			$('.sendMessage').click(function(){ //发送消息
				if($('#input-edit').val().replace('/\s+/','') != ''){
					var msg = html_encode($('#input-edit').val()), //取出输入框的值并对其中的特殊字符进行转义
						username = $('.username').text(); //获取用户名
						msg = send_emoji(msg); //对表情进行处理
					$('.msg-list-body').append("<li class='col-sm-12 col-xs-12'><div class='user_me'>我:</div>" +
						"<div class='msg my_msg'><div class='right'></div>" + msg + "</div></li>");
					$('#input-edit').val('');
					socket.emit('testEvent', msg, username); //发送当前用户名和消息到服务端
					window_scroll(); //内容框自动滚动
				} else {
					$('.if_none').html('*发送内容不能为空，请输入字符').fadeIn().fadeOut(2000);
				}
			});
			$('#input-edit').keydown(function(event){ //为文本框添加'keydown'事件
				if (event.keyCode == 13) { //用户按下enter时触发
					$('.sendMessage').click();
				}
			});
			$('.clear_msg').click(function(){ //清屏
				$('#msg').empty();
			});
		}
 	//===================在article页面执行=========================
		if($(".articles").text() != ''){
			fooN($('.articles>div'),$('.articles'),3);
			colorToggle($(".foon_pages li"),{
					"background":"#428BCA","color":"#fff","border-color":"#428BCA"
				},
				{
					"background":"#fff","color":"#428BCA","border-color":"#ccc"
				},
				{
					"background":"#eee","color":"#428BCA","border-color":"#ccc"
				});
			search();
		}
	//=============
		String.prototype.format = function (args) {
			var result = this;
			if (arguments.length > 0) {
				if (arguments.length == 1 && typeof (args) == "object") {
					for (var key in args) {
						if (args[key] != undefined) {
							var reg = new RegExp("({" + key + "})", "g");
							result = result.replace(reg, args[key]);
						}
					}
				}else {
					for (var i = 0; i < arguments.length; i++) {
						if (arguments[i] != undefined) {
							var reg = new RegExp("({)" + i + "(})", "g");
							result = result.replace(reg, arguments[i]);
						}
					}
				}
			}
			return result;
		}
		function fooN(obj,pages_in,per,li_width){//obj表示需要进行分页的元素,pages_in表示分页标签放置的位置,
			var articles = $(obj);				//per表示一页的数量
			if(articles.length>per){ //若长度超过一页最大数量则进行分页
				var per = per;
				var obj_parent = $(pages_in);
				var num = Math.ceil(articles.length/per);
				$(obj_parent).children('.foon_pages').remove(); //每次初始化将ul移除
				$(obj_parent).append("<ul class='foon_pages'><ul>"); //再重新添加
				for(var i = 0;i < num;i ++){
					j = i +1;
					$(".foon_pages").append("<li value='"+j+"'>"+j+"</li>");
				}
				var li_width_auto = $(".foon_pages li").width();
				// li_wid = 
				li_w = li_width?li_width:li_width_auto;
				var l = ($(".foon_pages li").length + 1)*li_w + "px";
				var pageli = $(".foon_pages li");
				$(articles).hide(); //先隐藏所有文章
				for(var i = 0;i < per;i ++){ //初始显示最后5篇文章
					$(articles[i]).show();
				}
				//分页标签切换
				for(var i = 0;i < pageli.length;i ++){ //点击标签根据标签的value值计算并显示相对应的文章
					$(pageli[i]).on("click",function(event){
						var n = $(this).val()-1;
						$(articles).hide();
						for(var i = per*n+1;i <= per*(n+1);i ++){
							$(articles[i-1]).show();
						}
					 	event.stopPropagation(); //阻止冒泡以防触发上级元素的点击事件
					});
				}
				$(".foon_pages").css("width",l);
			}
		}
		function colorToggle(obj,a,b,c){ //标签切换样式,obj表示标签数组,a表示标签在click后的样式
			var fir = $(obj).first();		//b表示普通状态的样式,c表示获得焦点时的样式
			$(fir).css(a).siblings().css(b).hover(function(){
				$(this).css(c);
			},function(){
				$(this).css(b);
			});
			for(var i = 0;i < obj.length;i ++){
				$(obj[i]).click(function(){
					$(this).css(a).siblings().css(b).hover(function(){
						$(this).css(c);
					},function(){
						$(this).css(b);
					});
					$(this).hover(function(){
						$(this).css(a);
					},function(){
						$(this).css(a);
					});
				});
			}
		}
		function search(){ //搜索所有文章
			var all_article = $('.articles_div'); //把所有文章先赋给all_article
			var titles = $(".titles");
			$('.article_search').on('keyup change',function(){ //绑定keyup和change事件
				if($(this).val().replace(/\s+/) != ''){
					var a = $(this).val();
					var article = [];
					for(var i = 0;i < titles.length;i ++){
						var text = $(titles[i]).text();
						if(text.indexOf(a) != -1){ //若titles内含有搜索文本
							article.push($(titles[i]).parent().parent()); //选取它所在的div
						}
					}
					$('.articles').html(article);
				}else{
					$('.articles').html(all_article); //当搜索条件为空时,展现所有文章
				}
				fooN($('.articles>div'),3);
			});
		}
		function addUserList(users){ //输出用户列表到'在线用户'面板
			$('.list-table').html('');
			var users_unique = [];
			for(var i = 0;i < users.length;i ++){
				if(users[i] != ''){
					users_unique.push(users[i]);
				}
			}
			$('.user_num').html(users_unique.length);
			for(var i = 0;i < users_unique.length;i ++){
				$('.list-table').append("<li>"+users_unique[i]+"<span></span></li>");
			}
			userlist_ui();
			// '<a style="margin-left: 10px" href="/tom/space">去他的空间看看</a>'
		}
		function userlist_ui(){ //为用户列表增加样式
			var user_list = $(".list-table li");
			for(var i = 0;i < user_list.length;i ++){
				$(user_list[i]).unbind();
				$(user_list[i]).hover(function(){
					var username = $(this).text();
					// $(this).addClass('grey').children('span').html('<a style="margin-left: 10px" href="/'+username+'/space">去他的空间看看</a>');
				},function(){
					$(this).removeClass('grey').children('span').empty();
				});
			}
		}
		function window_scroll(){ //窗口滚动和消息自动删除
			var msgs = $('.msg-list-body li');
			var chat_body  = $('.chat-body');
			var height = 0;
			for (var i = 0;i < msgs.length;i ++) {
				height += 10+$(msgs[i]).height(); //height = li总高度
				if(height > 400){ //当height超过400时自动滚动到最下面
					$(chat_body).scrollTop(height);
				}
				// if(height > 1000){ //当height超过1000时自动删除最上面4条消息=>导致浏览器崩溃
				// 	for(var i = 0;i < 5;i ++){
				// 		$('.msg-list-body li').eq(i).remove();
				// 	}
				// }
			}
		}
		function html_encode(str) { //将用户输入的特殊字符进行转义
			var s = ""; 
			if (str.length == 0) return ""; 
			s = str.replace(/&/g, "&gt;"); 
			s = s.replace(/</g, "&lt;"); 
			s = s.replace(/>/g, "&gt;"); 
			s = s.replace(/ /g, "&nbsp;"); 
			s = s.replace(/\'/g, "&#39;"); 
			s = s.replace(/\"/g, "&quot;"); 
			s = s.replace(/\n/g, "<br>"); 
			return s; 
		}
		function load_emoji(){ //加载图片和点击事件
			$('.emoji').hide(); //先隐藏
			for(var i = 1;i < 70;i ++){ //载入表情
				$('.emoji .images').append("<li><img src='/emoji/"+i+".gif' title="+i+"></li>");
			}
			fooN($('.emoji li'),$('.emoji'),21,24); //进行分页
			var pages = $('.emoji .foon_pages li'); //对分页标签进行样式处理
			colorToggle(pages,{
				"background":"#428BCA","color":"#fff","border-color":"#428BCA"
			},
			{
				"background":"#fff","color":"#428BCA","border-color":"#f2f2f2"
			},
			{
				"background":"#eee","color":"#428BCA","border-color":"#f2f2f2"
			});
			$('body').click(function(e){ //点击body事件使表情隐藏
				if(e.target != $('.emoji')){ //阻止了事件冒泡:1、为$('.emoji')添加click事件
					 $('.emoji').hide();			 //2、分页的切换事件function fooN()
				}														 //3、表情按钮的click事件
				});
			$('.emoji').click(function(e){
				e.stopPropagation(); //阻止事件冒泡
			});
			$('#emotion-btn').click(function(e){ //表情按钮
				$('.emoji').css({'border': '1px solid #ccc'}); //为防止页面加载时出现表情框border
				$('.emoji').toggle();
				e.stopPropagation();
			});
			var emojis = $('.emoji li img'); //点击单个表情将按格式其添加到输入框
			for (var i = 0;i < emojis.length;i ++){
				$(emojis[i]).on('click', function() {
					$('.emoji').hide();
					var img = "[#emoji:" + $(this).attr('title') + "]";
					var val = $('#input-edit').val();
					$('#input-edit').val(val + img);
				});
			}
		}
		function send_emoji(msg){
			var reg = /\[#emoji:\d+\]/g; //匹配表情
			while(match = reg.exec(msg)){ //当msg中还有与正则表达式匹配的字符时
				emojiIndex = match[0].slice(8, -1);
				msg = msg.replace(match[0], '<img src="/emoji/' + emojiIndex + '.gif" />');
			}
			return msg;
		}
	 // 	function getTime(){ //获取时间，格式为00:00
		// 	var date = new Date();
		// 	var hour = date.getHours(), //获取当前小时数(0-23)
		// 	min = date.getMinutes(), //获取当前分钟数(0-59)
		// 	sec = date.getSeconds(); //获取当前秒数(0-59)
		// 	var time = hour + ":" + min + ":" + sec;
		// 	return time;
		// }
});