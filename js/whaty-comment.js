//提交评价信息
function validateCommentForm() {
	var rating = $('#star').attr("value");
	if (rating == '') {
		alert("评分不能为空！");
		return false;
	}

	var content = $.trim($("#content").val());
	if (content == ''||content =='请输入您对本课堂的建议，谢谢！') {
		if(projectType==1 || projectType==3)
			alert("评论内容不能为空！");
		else
			alert("评价内容不能为空！");
		$("#content").focus();
		return false;
	}
	
	if (content.length > 200) {
		alert("评价内容应在1-200字以内！");
		$("#content").focus();
		return false ;
	}
	
	var isComment_add = $("#isComment_add").val();
	//重新提交数据
	if(isComment_add == "true" && $("#commentId").val() != ''){
		updateComment($("#commentId").val(), $("#current_user").val(), $("#author").val(), rating, $("#site_code").val(), $("#project_code").val(), content, "rating_value", "content");
	} else {
		saveComment($("#current_user").val(), $("#author").val(), rating, $("#site_code").val(), $("#project_code").val(), content, "rating_value", "content");
	}
}


//检查当前输入字数
function checkData(object) {
    var len = object.val().length;
	if(len < 1 ) { 	 
		alert('请输入回复内容'); 
		return false;
	}else if(parseInt(len) >200) {
		alert('回复内容应在1-200字以内');
		return false;
	} 
	return true;
}

//初始化评价注册
function registerProject(projectCode, projectName, projectType, siteCode){
	$.ajax({
        type:'post',  
		dataType:'json',
		contentType: "application/json; charset=UTF-8",
		data: JSON.stringify({code:projectCode, name:projectName, type:projectType, siteCode:siteCode}),
		url:'/comment/addProject',
		async: false
	});
}


//加载某个项目的评价列表
function LoadPage(projectCode, siteCode, pageNow_,pageSize_,startDisplay_,endDisplay_,maxDisplay_, showListDiv, showPageDiv){
	$("#" + showListDiv).empty();
	$("#" + showPageDiv).empty();
	var pageNow = parseInt(pageNow_);
	var pageSize = parseInt(pageSize_);
	var startDisplay = parseInt(startDisplay_);
	var endDisplay = parseInt(endDisplay_);
	var maxDisplay = parseInt(maxDisplay_);
	
	//获取当前page的评价列表；
	$.ajax({
        type:'post',  
		dataType:'json',
		data: {"pageNow":pageNow,"pageSize":pageSize,"projectCode":projectCode, "siteCode":siteCode},
		url:'/comment/queryCommentsByPage',
		success:function(json){ 
		   var zone = '';
		   $.each(json,function(i,key){
			   //针对初始评论
			   if(json[i].replyTo==0) {
					zone += '<div class="tkkcpjinfo"> \
								<div class="kcpjl"><img src="/learning/resbase/sites/code1/student/default/public/themes/wlkt/wyclassv2/images/kcpjs_03.jpg">'+(json[i].author.length>8? json[i].author.substr(0,8) : json[i].author)  +'</div> \
								<div class="kcpjr"> \
									<div><div class="pjdjbj"><div class="pjdj" style="width:'+(json[i].rating*10)+'%"></div></div><span class="kcpjtime">'+json[i].sendDate+'</span><div style="clear:both"></div></div> \
									'+json[i].content+'\
								</div> \
								<div style="clear:both"></div> \
							</div>';
			   }
          });
		  $("#" + showListDiv).html(zone);
        }
	});
	
	$.ajax({
		type:'post',  
		dataType:'json',
		data: {"pageNow":pageNow,"pageSize":pageSize,"projectCode":projectCode, "siteCode":siteCode},
		url:'/comment/queryPageModel',
		success:function(pageModel){				
			if(pageModel!=null){
				var pageZone = '<div class="pagetab"> \
									<div class="prepages"><a class="prepagea" href="javascript:LoadPage(\''+projectCode+'\', \''+siteCode+'\', '+(pageNow > 1 ? pageNow-1 : 1) +','+pageSize+','+startDisplay+','+endDisplay+','+maxDisplay+', \''+showListDiv+'\', \''+showPageDiv+'\')"></a></div> \
									<div class="pages" style="position:relative" onMouseOver="MM_showHideLayers(\'nian\',\'\',\'show\');" onMouseOut="MM_showHideLayers(\'nian\',\'\',\'hide\')">第'+pageNow+'页 \
										<div class="pagenums" id="nian">';
				for(var i = 1; i<= pageModel.pageNum; i++){
					pageZone += '<a href="javascript:LoadPage(\''+projectCode+'\', \''+siteCode+'\', '+ i +','+pageSize+','+startDisplay+','+endDisplay+','+maxDisplay+', \''+showListDiv+'\', \''+showPageDiv+'\')">第'+ i +'页</a>';
				}
				
				pageZone += '</div></div> \
								<div class="nextpages"><a class="nextpagea" href="javascript:LoadPage(\''+projectCode+'\', \''+siteCode+'\', '+(pageNow < pageModel.pageNum ? pageNow+1 : pageModel.pageNum) +','+pageSize+','+startDisplay+','+endDisplay+','+maxDisplay+', \''+showListDiv+'\', \''+showPageDiv+'\')"></a></div> \
							</div> \
							<div style="clear:both"></div>';
				$("#" + showPageDiv).html(pageZone);
			}
		}
	});
}

//针对某个project发表评论
function saveComment(currentUser, author, rating, siteCode, projectCode, content, ratingDiv, contentDiv) {
    $.ajax({
		type : "POST",
	    url: "/comment/addComment",
	    data: JSON.stringify({userKey: currentUser, author: author, rating: rating, siteCode: siteCode, content: content, project: {code: projectCode}}),
		dataType : "json",
		contentType: "application/json; charset=UTF-8", 
		success : function(data, stats) {   
            if (stats == "success")  {
            	if(data) {
					$('#'+ratingDiv).html('<div class="gd" id="rating"> \
											<input type="hidden" id="isComment_add" value="true"> \
											<input type="hidden" id="commentId" value=""> \
											<div class="gdi" style="width:'+(rating*10)+'%"></div> \
										   </div>');
					$('#'+ contentDiv).attr("value", content);
					alert("评论成功！");
                } else {
					alert("评论失败, 请重新提交");
                }
            } else {
				alert("评论失败, 请重新提交");
            }     
        }, 
		error : function(data) {   
            alert("网络繁忙，请稍后重试！");   
        }
	});
}


//获取某个项目的评价统计信息
function getCommentStaticInfo(projectCode, siteCode, authNumDivId, authRatingDivId){
	$.ajax({
		type : "POST",
	    url: "/comment/queryProjectStatInfo",
	    data: {"projectCode":projectCode, "siteCode": siteCode},
		dataType : "json",
		success : function(data, stats) {   
            if (stats == "success")  {
            	if(data) {
					if(typeof(authRatingDivId) != 'undefined'){
						$('#'+authRatingDivId).css("width", (data.averageRating * 10) + '%');
					}
					if(typeof(authNumDivId) != 'undefined'){
						$('#'+authNumDivId).html(data.authorNum);
					}
                } else {
                }
            } else {
            }     
        }, 
		error : function(data) {   
        }
	});
}

//根据loginId、projectCode、sitecode 查询个人评价信息
function queryCommentByAuthor(currentUser, projectCode, siteCode, ratingDiv, contentDiv){
	$.ajax({
		type : "POST",
	    url: "/comment/queryCommentByAuthor",
	    data: {"currentUser":currentUser, "projectCode":projectCode, "siteCode": siteCode},
		dataType : "json",
		success : function(data, stats) {   
            if (stats == "success")  {
				$('#'+ratingDiv).html('');
            	if(data) {
					$('#'+ratingDiv).html('<div class="gd" id="rating"> \
											<input type="hidden" id="isComment_add" value="true"> \
											<input type="hidden" id="commentId" value="'+data.id+'"> \
											<div class="gdi" style="width:'+(data.rating*10)+'%"></div> \
											</div>');
					$('#'+contentDiv).html(data.content);
                } else {
					$('#'+ratingDiv).html('<div class="nopj">还没有评价哦~~</div>');
                }
            } else {
				$('#'+ratingDiv).html('<div class="nopj">加载失败~~</div>');
            }     
        }, 
		error : function(data) {   
            $('#'+ratingDiv).html('<div class="nopj">加载失败~~</div>');  
        }
	});
}

//修改个人评价
function updateComment(commentId, currentUser, author, rating, siteCode, projectCode, content, ratingDiv, contentDiv){
    $.ajax({
		type : "POST",
	    url: "/comment/updateComment",
	    data: JSON.stringify({id:commentId, userKey: currentUser, author: author, rating: rating, siteCode: siteCode, content: content, project: {code: projectCode}}),
		dataType : "json",
		contentType: "application/json; charset=UTF-8", 
		success : function(data, stats) {   
            if (stats == "success")  {
            	if(data && data.success) {
					$('#'+ratingDiv).html('<div class="gd" id="rating"> \
											<input type="hidden" id="isComment_add" value="true">\
											<input type="hidden" id="commentId" value="'+commentId+'"> \
											<div class="gdi" style="width:'+(rating*10)+'%"></div> \
										   </div>');
					$('#'+contentDiv).html(content);
					alert("重新提交评论成功！");
                } else {
					alert("更新评论失败, 请重新提交");
                }
            } else {
				alert("更新评论失败, 请重新提交");
            }     
        }, 
		error : function(data) {   
            alert("网络繁忙，请稍后重试！");   
        }
	});
}


