//课堂简介页面：根据班级Id 获取学员列表
function getStudentListByClassId(classId, stutotal_divid, stulist_divid) {
	var url = "/learning/plugin/ajaxData_ajax.action?serviceName=wlktStudent&modle=getStudentMapsByClassId";
	url +=  "&classId="+ classId ;
	url += "&siteCode="+_CSITECODE_;
	url += "&web_domain=" + _WEB_DOMAIN_;
	
	$.ajax({
		url: url,
		dataType: "json",
		async: false,
		beforeSend: function(data) {
		},
		error:function (XMLHttpRequest,textStatus, errorThrown) {
		},
		success: function(data) {
			var html = '';
			var stulist = data.studentList;
			for(var i=0; i<(stulist.length > 9? 9 : stulist.length); i++){
				html += '<div class="ktxyi" '+ ( (i+1)%3 ==0 ? 'style="margin-right:0px;"' : '')+'><img src="/learning'+stulist[i]["avatar.big"]+'" width="55" height="55" /></div>';
			}
			
			html += '<div style="clear:both"></div>';
			$('#'+stulist_divid).html(html);
			$('#'+stutotal_divid).html( '<img src="/learning/resbase/sites/code1/student/default/public/themes/wlkt/wyclassv2/images/tp_06.png" width="20" height="20" align="absmiddle"  alt=""/>' +stulist.length + '位学员已加入课堂');
		}
	});
}

//根据班级id获取教师列表
function loadTeachersByClassId(classId , divId){	
	var url = "/learning/plugin/ajaxData_ajax.action?serviceName=wlktStudent&modle=getTeachersByClassId";	
	url +=  "&classId="+ classId ;
	url += "&siteCode="+_CSITECODE_;
	url += "&web_domain=" + _WEB_DOMAIN_;
	
	$.ajax({
		url: url,
		dataType: "json",
		async: false,
		beforeSend: function(data) {
		
		},
		error:function (XMLHttpRequest,textStatus, errorThrown) {
		},
		success: function(data) {
			var html = '';
			if(data && data.message == "success"){
				var teachers = data.teacherList;
				for(var i=0;i<teachers.length;i++){
					var tmp_teacher = teachers[i];
					var tName = tmp_teacher["name"];
					var tPhotoURL = tmp_teacher["avatar.big"];
					var tSex= tmp_teacher["sex"];
					var tPosTitle = tmp_teacher["positionalTitle"];
					var tPhoneNum = tmp_teacher["mobilePhone"];
					var tNote = tmp_teacher["note"];
					html += '<div class="tdb" id="dslist_'+i+'" onclick="javascript:loadTeacherDetail(\''+tPhotoURL+'\',\''+tName+'\', \''+tSex+'\', \''+tPosTitle+'\', \''+tPhoneNum+'\', \''+tNote+'\')"><a href="#"> \
								<div class="tdi"><img src="/learning'+tmp_teacher["avatar.middle"]+'" width="73" height="73" /></div>'+ tName+'<br>\
						'+(tPosTitle.length > 16 ? (tPosTitle.substr(0,16)+'...') : tPosTitle)+'<br></a>\
								  <div style="clear:both"></div>\
							</div>';			
				}
			} else {
				
			}

			$('#'+ divId).html(html);
		}
	});
}


//加载班级学员热门学习课堂
function getHotClassByClassId(pageNum, pageSize, searchClsId, divId, searchPid) {
	if(pageNum < 1){ pageNum = 1;}
	if(pageSize < 3) { pageSize = 3;}
	if(!searchClsId || searchClsId == 'undefined') { searchClsId = '';}
	if(!searchPid || searchPid == 'undefined') { searchPid = '';}
	var url = "/ajaxData.action?serviceName=generalSelect&method=getDataLst&typeCode=getClassByClassId";
	url +=  "&start="+ pageNum +"&limit="+pageSize+"&sort=ptc.renshu&dir=desc";
	url +=  "&search__cid=" + searchClsId + "&search__pid=" + searchPid;
	url += "&search__siteCode=" + _CSITECODE_;
	$.ajax({
		url: url,
		dataType: "json",
		async: false,
		beforeSend: function(data) {
		},
		error:function (XMLHttpRequest,textStatus, errorThrown) {
		},
		success: function(data) {
			$('#'+ divId).html('');
			if(!data.page || data.page == 'undefined') { 
				$('#'+ divId).html("");
				return; 
			}
			var classList = data.page.items;
			var html = '';
			for(var i=0;i<classList.length;i++){
				var tmp_class = classList[i];
				html += '<div class="klb" onclick="javascript:open_class(\''+ tmp_class[14] +'\')">'+tmp_class[5]+' \
							<div> \
							  <div class="klbi"><img src="'+tmp_class[7]+'" width="73" height="39"  alt=""/></div> \
							  <div class="pf ktpf"> \
								<span class="rs">'+tmp_class[8]+'人在学</span>\
								<div class="fsw"><div id="fsn_'+tmp_class[14]+'"class="fsn" style="width:100%"></div></div>\
								<div style="clear:both"></div>\
							   </div><div style="clear:both"></div> \
						    </div>\
						</div>';
			}
			
			if(classList.length == 0) { html = "暂无课堂资源，敬请期待！";}
			$('#'+ divId).html(html);
		}
	});
}


//按条件获取某个分类下的课堂列表
function getClassList(isCommend, typPageNum, typPageSize, clspageNum, clspageSize, clsTypId, divId) {
	var url = "/learning/plugin/ajaxData_ajax.action?result=categorylist&serviceName=wlktStudent&modle=listMoreClsByTyp";
	url +=  "&isCommend="+ isCommend +"&typPageNum="+typPageNum+"&typPageSize="+typPageSize;
	url +=  "&orderBy=code&orderType=asc&clsorderBy=sequence&clsorderType=desc";
	url +=  "&clspageNum="+clspageNum+"&clspageSize="+clspageSize+"&clsTypId="+clsTypId;
	url += "&siteCode="+_CSITECODE_;
	url += "&siteId="+_CSITEID_;
	
	$.ajax({
		url: url,
		dataType: "json",
		async: false,
		beforeSend: function(data) {
		},
		error:function (XMLHttpRequest,textStatus, errorThrown) {
		},
		success: function(data) {
				//return;
			$('#'+ divId).html('');
			var classList = data.clssPagerBean.list;
			var html = (isCommend==1 ?'' : '<div class="m2tas"></div>');
			for(var i=0;i<classList.length;i++){
				var tmp_class = classList[i];
				var tmp_jgnote = tmp_class.children[7].value;
				var tmp_jgStartDate = tmp_class.children[16].value;
				tmp_jgStartDate = tmp_jgStartDate.split(' ')[0];
				html += '<div class="'+ (isCommend==1? 'boxin' : 'boxins') +'"'+ ((i+1)%4==0 ? 'style="margin-right:0;"' : '')+ ' \
							><div class="boxs" onclick="open_class(\''+tmp_class.value+'\')"> \
							<div class="box1"> \
							<div class="mi"><img src="'+_RESBASE_ + '/' +tmp_class.children[3].value+'" width="223" height="122"> \
							<div class="sj">'+tmp_jgStartDate+'</div></div> \
							<div class="mt">'+tmp_class.children[1].value+'</div> \
							<div class="pf"><span class="rs">'+tmp_class.children[9].value+'</span> <div class="gd"><div id="gdi_'+ tmp_class.value +'" class="gdi" style="width:100%"></div></div><div style="clear:both"></div></div> \
							<div class="jg"> \
							  <div class="jgi"><img src="'+tmp_class.children[10].value+'" ></div> \
							  <strong>'+tmp_class.children[6].value+'</strong><br> \
					'+ (tmp_jgnote.length>10? tmp_jgnote.substr(0,10) : tmp_jgnote) +' \
							  <div style="clear:both"></div> \
							</div> \
						  </div> \
						</div></div>';
				
				
				//加载每个课程的评价信息
				getCommentStaticInfo(tmp_class.value, $("#site_code").val(), null, "gdi_"+tmp_class.value);
			}
			
			if(isCommend == 1){
				html += '<div style="clear:both"></div>';
			} else {
				html += '<div class="kcflpage"> \
							<div class="pagetab"> \
								<div class="prepages"><a href="javascript:getClassList('+isCommend+', '+typPageNum+', '+typPageSize+', '+(data.clssPagerBean.pageNumber>1? data.clssPagerBean.pageNumber-1: 1)+', '+clspageSize+', \''+clsTypId+'\', \''+divId+'\')"></a></div> \
								<div class="pages" style="position:relative" onMouseOver="MM_showHideLayers(\'nian\',\'\',\'show\');" onMouseOut="MM_showHideLayers(\'nian\',\'\',\'hide\')">第'+data.clssPagerBean.pageNumber+'页 \
									<div class="pagenums" id="nian">';
				for(var i_page = data.clssPagerBean.pageCount; i_page > 0; i_page-- ){ 
					html += '<a href="javascript:getClassList('+isCommend+', '+typPageNum+', '+typPageSize+', '+i_page+', '+clspageSize+', \''+clsTypId+'\', \''+divId+'\')">第'+i_page+'页</a>';
				}
				
				html +=   		'</div></div> \
								<div class="nextpages"><a href="javascript:getClassList('+isCommend+', '+typPageNum+', '+typPageSize+', '+(data.clssPagerBean.pageNumber<data.clssPagerBean.pageCount? data.clssPagerBean.pageNumber+1: data.clssPagerBean.pageCount)+', '+clspageSize+', \''+clsTypId+'\', \''+divId+'\')"></a></div> \
							</div> \
							<div style="clear:both"></div>';			
			}
			
			$('#'+ divId).html(html);
			
			
			$(".boxin").mouseenter(function(){
				$(this).css("background","#b7b7b7");
			});
			
			$(".boxin").mouseleave(function(){
				$(this).css("background","#ffffff");
			});
			  
			$(".boxins").mouseenter(function(){
				$(this).css("background","#b7b7b7");
			});
			
			$(".boxins").mouseleave(function(){
				$(this).css("background","#ffffff");
			});
		}
	});
}

//获取课堂信息的接口getclassInfo
//http://www.demo.webtrn.cn/learning/plugin/ajaxData_ajax.action?serviceName=wlktStudent&modle=getClassInfo&classId=40288397431e49ca01431efcf55e0034&siteId=40288c77312130540131213a58472311&siteCode=code1
function getClassInfoByClassId(classId , divId){	
	var url = "/learning/plugin/ajaxData_ajax.action?serviceName=wlktStudent&modle=getClassInfo";	
	url +=  "&classId="+ classId ;
	url += "&siteCode="+_CSITECODE_;
	url += "&siteId="+_CSITEID_;
	
	$.ajax({
		url: url,
		dataType: "json",
		async: false,
		beforeSend: function(data) {
		
		},
		error:function (XMLHttpRequest,textStatus, errorThrown) {
		},
		success: function(data) {
			var html = '';
			if(data && data.message == "success"){
			} else {
				
			}

			$('#'+ divId).html(html);
		}
	});
}


//根据开课id获取课件信息
function getTaskListByOpencoureId(opencourseId , divId){	
	var url = "/learning/plugin/ajaxData_ajax.action?serviceName=wlktStudent&modle=getCoursewareItemListByOpenCourseId";	
	url +=  "&openCourseId="+ opencourseId ;
	url += "&siteCode="+_CSITECODE_;
	url += "&siteId="+_CSITEID_;
	
	$.ajax({
		url: url,
		dataType: "json",
		async: false,
		beforeSend: function(data) {
		
		},
		error:function (XMLHttpRequest,textStatus, errorThrown) {
		},
		success: function(data) {
			var html = '';
			if(data && data.message == "success"){
			} else {
				
			}

			$('#'+ divId).html(html);
		}
	});
}


//根据项目信息获取班级信息
function getClassListByProject(pageNum, pageSize, searchName, searchPid, divId, pageDivId) {
	if(pageNum < 1){ pageNum = 1;}
	if(pageSize < 3) { pageSize = 3;}
	if(!searchName || searchName == 'undefined') { searchName = '';}
	if(!searchPid || searchPid == 'undefined') { searchPid = '';}
	var url = "/ajaxData.action?serviceName=generalSelect&method=getDataLst&typeCode=getClassByProject";
	url +=  "&start="+ pageNum +"&limit="+pageSize+"&sort=ptc.renshu&dir=desc";
	url +=  "&search__cname=" + searchName + "&search__pid=" + searchPid;
	url += "&search__siteCode=" + _CSITECODE_;
	$.ajax({
		url: url,
		dataType: "json",
		async: false,
		beforeSend: function(data) {
		},
		error:function (XMLHttpRequest,textStatus, errorThrown) {
		},
		success: function(data) {
			$('#'+ divId).html('');
			$('#'+ pageDivId).html('');
			if(!data.page || data.page == 'undefined') { 
				$('#'+ divId).html("暂无课堂资源，敬请期待！");
				return; 
			}
			var classList = data.page.items;
			var html = '';
			for(var i=0;i<classList.length;i++){
				var tmp_class = classList[i];
				html += '<div class="boxins" '+ ((i+1)%4 == 0 ? 'style="margin-right:0;"' : '' )+' onclick="open_class(\''+tmp_class[14]+'\')"> \
							<div class="boxs"> \
							  <div class="box1"> \
								<div class="mi"><img src="'+tmp_class[7]+'" width="223" height="122"> \
								<div class="sj">' +tmp_class[15].substring(0,10)+'</div>\
								<div class="grwc"><div class="grwct"><a href="#">了解更多</a></div></div></div> \
								<div class="mt">'+tmp_class[5]+'</div> \
								<div class="pf"><span class="rs">'+(tmp_class[8] == ''? '0' : tmp_class[8] )+'</span> <div class="gd"><div id="gdi_'+ tmp_class[14] +'" class="gdi" style="width:100%"></div></div><div style="clear:both"></div></div> \
								<div class="jg"> \
								  <div class="jgi"><img src="'+tmp_class[4]+'" width="36" height="36" ></div> \
								  <strong>'+tmp_class[3]+'</strong><br> \
						教育部直属重点大学 \
								  <div style="clear:both"></div> \
								</div> \
							  </div> \
							</div> \
							</div>';
				
				//加载每个课程的评价信息
				getCommentStaticInfo(tmp_class[14], $("#site_code").val(), null, "gdi_"+tmp_class[14]);
			}
			
			if(classList.length == 0) { html = "暂无课堂资源，敬请期待！"}
			html += '<div style="clear:both"></div>'
			$('#'+ divId).html(html);
			
			//设置分页部分
			var pageHtml = '';
			var totalPage = parseInt(data.page.totalCount/pageSize);
			if(data.page.totalCount%pageSize != 0) totalPage += 1;
			if(totalPage > 1){
				pageHtml += '<div class="kcflpage"> \
							<div class="pagetab">';
				if(pageNum>1){			
					pageHtml += '<div class="prepages"><a class="prepagea" href="javascript:getClassListByProject('+(pageNum-1)+', '+pageSize+', \''+searchName+'\', \''+searchPid+'\', \''+divId+'\',  \''+pageDivId+'\')"></a></div>';
				}else{
					pageHtml +='<div class="prepages"><a class="prepagen" href="javascript:void(0)"></a></div>';
				}
				pageHtml += '<div class="pages" style="position:relative" onMouseOver="MM_showHideLayers(\'nian_jgclasslist\',\'\',\'show\');" onMouseOut="MM_showHideLayers(\'nian_jgclasslist\',\'\',\'hide\')">第'+pageNum+'页 \
								<div class="pagenums" id="nian_jgclasslist">';
				for(var i_page = (pageNum+5 >totalPage? totalPage : pageNum+5); i_page > pageNum; i_page-- ){ 
					pageHtml += '<a href="javascript:getClassListByProject('+i_page+', '+pageSize+', \''+searchName+'\', \''+searchPid+'\', \''+divId+'\',  \''+pageDivId+'\')">第'+i_page+'页</a>';
				}

				pageHtml += '</div></div>';
				if(pageNum<totalPage){
				pageHtml += '<div class="nextpages"><a class="nextpagea" href="javascript:getClassListByProject('+(pageNum+1)+', '+pageSize+', \''+searchName+'\', \''+searchPid+'\', \''+divId+'\',  \''+pageDivId+'\')"></a></div>';
				}else{
					pageHtml += '<div class="nextpages"><a class="nextpagen" href="javascript:void(0)"></a></div>';
				}
				pageHtml += '</div>\
						<div style="clear:both"></div></div>';
				$('#'+ pageDivId).html(pageHtml);
			}
					
		}
	});
}
//根据课程名称和项目id搜索网梯课堂下的课程资源
//ajaxData.action?serviceName=generalSelect&method=getDataLst&typeCode=getClassByProject&start=1&limit=20&search__cname=课&search__pid=40288397431e49ca01431ee2cd13001f&sort=ptc.renshu&dir=desc
function getSearchClassList(pageNum, pageSize, searchName, searchPid, divId, pageDivId) {
	if(pageNum < 1){ pageNum = 1;}
	if(pageSize < 3) { pageSize = 3;}
	if(!searchName || searchName == 'undefined') { searchName = '';}
	if(!searchPid || searchPid == 'undefined') { searchPid = '';}
	var urlSearchName = encodeURI(searchName);
	var url = "/ajaxData.action?serviceName=generalSelect&method=getDataLst&typeCode=getClassByProject";
	url +=  "&start="+ pageNum +"&limit="+pageSize+"&sort=ptc.renshu&dir=desc";
	url +=  "&search__cname=" + urlSearchName + "&search__pid=" + searchPid;	
	url += "&search__siteCode=" + _CSITECODE_;
	
	$.ajax({
		url: url,
		dataType: "json",
		async: false,
		beforeSend: function(data) {
		},
		error:function (XMLHttpRequest,textStatus, errorThrown) {
		},
		success: function(data) {
			$('#'+ divId).html('');
			$('#'+ pageDivId).html('');
			if(!data.page || data.page == 'undefined') { 
				$('#input_classkey').html(searchName);
				$('#input_ywkey').html(searchName);
				$('#'+ divId).html("暂无课堂资源，敬请期待！");
				return; 
			}
			var classList = data.page.items;
			var html = '';
			for(var i=0;i<classList.length;i++){
				var tmp_class = classList[i];
				html += '<div class="ssjgkczy" onclick="javascript:open_class(\''+ tmp_class[14] +'\')">  \
							<div> \
								<div class="lczyimg"><img src="'+ tmp_class[7]+'" width="165"></div> \
								<div class="kcayinfo"><a href="#"><h2 class="kcmc"><span>'+ tmp_class[5] +'</span></h2>'+tmp_class[11]+'</a></div> \
								<div style="clear:both;"></div> \
							</div> \
							<div> \
								<div class="xxqk"> \
									<div class="xxqkrs">'+(tmp_class[8] == ''? '0' : tmp_class[8] )+'</div> \
									<div class="djbz"><div class="fswsel"><div id="scomment_'+ tmp_class[14] +'" class="fsnsel" style="width:100%"></div></div></div> \
								</div> \
								<div class="kccz"> \
									<a href="#" class="ssjgdel"></a> \
									<a href="#" class="ssjgadd"></a> \
								</div> \
								<div style="clear:both;"></div> \
							</div> \
					  </div>';
				
				//加载每个课程的评价信息
				getCommentStaticInfo(tmp_class[14], $("#site_code").val(), null, "scomment_"+tmp_class[14]);
			}
			
			if(classList.length == 0) { html = "暂无课堂资源，敬请期待！"}
			$('#input_classkey').html(searchName);
			$('#input_ywkey').html(searchName);
			$('#'+ divId).html(html);
			
			//设置分页部分
			var pageHtml = '';
			var totalPage = parseInt(data.page.totalCount/pageSize);
			if(data.page.totalCount%pageSize != 0) totalPage += 1;
			if(totalPage > 1){
				pageHtml += '<div class="kcflpage"> \
							<div class="pagetab">\
							<div class="prepages">';
			if(totalPage > 1){
				pageHtml += '<a class="prepagea" href="javascript:getSearchClassList('+(pageNum>1? pageNum-1: 1)+', '+pageSize+', \''+searchName+'\', \''+searchPid+'\', \''+divId+'\',  \''+pageDivId+'\')"></a>';
			}else{
					pageHtml += '<a class="prepagen" href="javascript:void(0)"></a>';
			}
				pageHtml += '</div> \
							<div class="pages" style="position:relative" onMouseOver="MM_showHideLayers(\'nian_jgclasslist\',\'\',\'show\');" onMouseOut="MM_showHideLayers(\'nian_jgclasslist\',\'\',\'hide\')">第'+pageNum+'页 \
								<div class="pagenums" id="nian_jgclasslist">';
				for(var i_page = (pageNum+5 >totalPage? totalPage : pageNum+5); i_page > pageNum; i_page-- ){ 
					pageHtml += '<a href="javascript:getSearchClassList('+i_page+', '+pageSize+', \''+searchName+'\', \''+searchPid+'\', \''+divId+'\',  \''+pageDivId+'\')">第'+i_page+'页</a>';
				}

				pageHtml += '</div></div> <div class="nextpages">';
				if(pageNum < totalPage){
					pageHtml += '<a class="nextpagea" href="javascript:getSearchClassList('+(pageNum<totalPage? pageNum+1: totalPage)+', '+pageSize+', \''+searchName+'\', \''+searchPid+'\', \''+divId+'\',  \''+pageDivId+'\')"></a>';
				}else{
					pageHtml += '<a class="nextpagen" href="javascript:void(0)"></a>';
				}
				pageHtml += '	</div> \
						</div> \
						<div style="clear:both"></div>';
				$('#'+ pageDivId).html(pageHtml);
			}
		}
	});
}

