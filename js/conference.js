;(function($) {
	var conference = {
		_current : 0,  //当前问题模版的索引
		bindEvts : function(){
			$(document).ready(function(){
				/**
				 * 发布会现场页面事件
				 */
				//回复和确认回复
				$('.question-item').click(function(e){
					var t = $(e.target),
						action = t.attr('data-action'),
						questionItem = $(this);
					if(action == 'reply'){                   //回复
						t.addClass('hide');
						questionItem.append($('<div class="reply"><div class="reply-txt textarea-wrapper"><textarea maxlength="200"></textarea></div><div class="btn-reply-sure" data-action="reply-sure">确认</div></div>'));
					}else if(action == 'reply-sure'){        //确认回复
						var textarea = questionItem.find('textarea'),
							content = textarea.val(),
							replyTxt = questionItem.find('.reply-txt');

						if(t.hasClass('submiting')){
							return false;
						}else{
							if(content.length == 0){   //无输入
								replyTxt.css('border-color', '#ffbc1c');
								return false;
							}else{                     //提交
								questionItem.find('.reply').addClass('hide');
								questionItem.append($('<div class="answer"><span class="q">答：</span><span class="txt">' + content + '</span></div>'));
								//post
								/*$.ajax({
									'url' : '',
									'data' : {'content' : content},
									'dataType' : 'json',
									'type' : 'post',
									'success' : function(d){
										t.removeClass('submiting');
										if(d.rtn == 1){
											questionItem.find('.reply').addClass('hide');
											questionItem.append($('<div class="answer"><span class="q">答：</span><span class="txt">' + content + '</span></div>'));
										}else{
											alert('网络连接失败，请重试');
										}
									},
									"error":function(){
										t.removeClass('submiting');
										alert('网络连接失败，请重试');
									}
								});*/
							}
						}
					}
				});

				//赞和踩
				$('.asker-detail-cnt').find('.eva').click(function(){
					var eva = $(this),
						result = eva.hasClass('like') ? 1 : 0;  //赞：1，踩0

					if($('.evaluta').hasClass('submiting') || (result == 1 && eva.hasClass('e-like')) || (result == 0 && eva.hasClass('e-unlike'))){  //正在提交请求或二次赞或二次踩
						return false;
					}else{
						if(result){  //当前点击的是“赞”
							eva.addClass('e-like');
							eva.siblings('.eva').removeClass('e-unlike');
						}else{  //当前点击的是“踩”
							eva.addClass('e-unlike');
							eva.siblings('.eva').removeClass('e-like');
						}
						//post
						/*$.ajax({
							'url' : '',
							'data' : {'eva' : result},
							'dataType' : 'json',
							'type' : 'post',
							'success' : function(d){
								$('.evaluta').removeClass('submiting');
								if(d.rtn == 1){
									if(result){  //当前点击的是“赞”
										eva.addClass('e-like');
										eva.siblings('.eva').removeClass('e-unlike');
									}else{  //当前点击的是“踩”
										eva.addClass('e-unlike');
										eva.siblings('.eva').removeClass('e-like');
									}
								}else{
									alert('网络连接失败，请重试');
								}
							},
							"error":function(){
								$('.evaluta').removeClass('submiting');
								alert('网络连接失败，请重试');
							}
						});*/
					}
					
				});

				/**
				 * 提问页面事件
				 */
				//换一组问题
				$('.refresh').click(function(e){
					var total = $('.temp-list').length, 
						next;

					if(total == 1){
						$(this).hide();
						return;
					}else{
						if(conference._current == total - 1){
							next = 0;
						}else{
							next = conference._current + 1;
						}
						//当前问题面板隐藏，下一轮问题面板展示
					    $('.temp-list').each(function(index){
					    	if(index != next){
					    		$('.temp-list').eq(index).css({'opacity' : '0', 'z-index' : '999'});
					    	}
					    });
					    var nextSlide = $('.temp-list').eq(next);
						nextSlide.css({'opacity' : '1', 'z-index' : '1000'});

						conference._current = next;
					}
				});

				//从问题模版中选择一个问题
				$('.temp').click(function(){
					$('.ico-yes').hide();
					$(this).find('.ico-yes').show();
					var question = $(this).find('.txt').text();
					$('.ask-txt').find('textarea').val(question).focus();

				});

				//提问
				$('.btn-ask-sure').click(function(){
					var textarea = $('.ask-cnt').find('textarea'),
						content = textarea.val(),
						askTxt = $('.ask-cnt').find('.ask-txt');

					if($(this).hasClass('submiting')){
						return false;
					}else{
						if(content.length == 0){   //无输入
							askTxt.css('border-color', '#ffbc1c');
							return false;
						}else{                     //提交
							$('.dialog-wraper').removeClass('hide');
							//post
							/*$.ajax({
								'url' : '',
								'data' : {'content' : content},
								'dataType' : 'json',
								'type' : 'post',
								'success' : function(d){
									$(this).removeClass('submiting');
									if(d.rtn == 1){
										$('.dialog-wraper').show();
									}else{
										alert('网络连接失败，请重试');
									}
								},
								"error":function(){
									$(this).removeClass('submiting');
									alert('网络连接失败，请重试');
								}
							});*/
						}
					}
				});

				//关闭提问成功对话框
				$('.close-dialog').click(function(){
					$('.dialog-wraper').addClass('hide');
					//跳转到发布会现场
					window.location.href="../html/c_detail_asker.html";
				});
				

				/**
				 * 公共
				 */
				//文本框focus
				$('textarea').live('focus', function() {
					var wrapper = $(this).parents('.textarea-wrapper');
					wrapper.css('border-color', '#4cbec1');

				});

				//分享到朋友圈
				
				//关注叽叽
			});
		},

		init : function(){
			conference.bindEvts();

			//初始化问题模版样式
			/*if($('.temp-list')[0]){
				var total = $('.temp-list').length,
					ulWidth = $('.temp-list-cnt').width();
				$('.temp-list').css('width', ulWidth);
				$('.temp-list-wrapper').css('width', ulWidth * total);
			}*/
		}
	};

	conference.init();
})(Zepto);