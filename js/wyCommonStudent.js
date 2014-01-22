//课堂辅导页面：根据班级Id 获取学员列表
function getInclassStudentListByClassId(classId, stulistDiv, web_domain) {
	var url = "/learning/entity/student/commonStudent_ajax.action?serviceName=wlktStudent&modle=getStudentMapsByClassId";
	url +=  "&classId="+ classId ;
	if(typeof(web_domain) != 'undefined'){
		url += "&web_domain="+web_domain;
	}
	
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
			for(var i=0; i<stulist.length; i++){
				var nickname = stulist[i]["nickName"];
				html += '<div class="bkttxlist">  \
							<div class="bkttxlistimg"><img src="/learning'+stulist[i]["avatar.middle"]+'" width="60" height="60" /></div> \
							<div class="bkttxlistgz">'+(nickname.length > 8? nickname.substr(0, 8) : nickname) +'</div> \
						</div>';
			}
			
			html += '<div style="clear:both"></div>';
			$('#'+stulistDiv).html(html);
		}
	});
}

//加载班级公告
function  showClassBulletin(classId, siteCode, pageNum, pageSize){
	var url="/learning/entity/student/commonStudent_ajax.action?serviceName=wlktStudent&modle=getClassBulletinList"
	url += "&classId="+classId;
	url += "&siteCode="+siteCode;
	url += "&pageNum="+pageNum;
	url += "&pageSize="+pageSize;
	
	$.ajax({
		url: url,
		dataType: "json",
		beforeSend: function(data) {
			
		},
		error:function (XMLHttpRequest,textStatus, errorThrown) {
				
		},
		success: function(data) {
			var items = data.page.items;
			var result ="";
			
			if(items&&items.length>0){
				for(var i = 0;i<items.length;i++){
					var it = items[i];
					var title = it.title;
					var showTitle = title.length > 40? (title.substr(0,40)+"..."):title;
					title = title.length > 15? (title.substr(0,15)+"..."):title;
					var publishDate = it.publish_date;
					publishDate = getDateIntervalWithNow(publishDate);
					
					var note=it.note;
					var author=it.TRUE_NAME;
					var id=it.id;
				    
					if(pageNum == 1 && i==0){
						$("#1stNotice_title").html(title);
						$("#lstNotice_date").html(publishDate);
					}
					var divid = "noti_"+i;
					result += '<div class="gacm" onclick="javascript:openClassDetail(\''+divid+'\')" id="'+divid+'"><div class="gal" id="title_'+divid+'">'+title+'</div><span class="gt">'+publishDate+'</span><div  id="note_'+divid+'" style="display:none">'+note+'</div><div  id="showTitle_'+divid+'" style="display:none">'+showTitle+'</div></div>';
				}
				

				if(items.length < pageSize){
				} else {
				//	result += '<div class="gacjz">很久以前</div>';
				}	
			}
			$("#gac").html(result);
		}
	});
}

//根据loginid 查询学员当前正在学的课堂列表 status == 1 正在开展  certificateGetStatus == 1 未领取证书
function  queryMyClassList(curPage, pageSize, status, certificateGetStatus, showdiv){
	var url= "/learning/u/circle/getMyClass.json?data=info";
	url += "&page.curPage="+curPage;
	url += "&page.pageSize="+pageSize;
	url += "&page.searchItem.status="+status;
	url += "&page.searchItem.certificateGetStatus="+certificateGetStatus;
	
	$.ajax({
		url: url,
		dataType: "json",
		beforeSend: function(data) {
			
		},
		error:function (XMLHttpRequest,textStatus, errorThrown) {
				
		},
		success: function(data) {
			if(data.errorCode == 0 && data.page){
				var html = "";
				if(data.page.items.length <= 0){
					html += '<div class="mykc"><img src="'+_RESBASE_+'/public/themes/wlkt/wyclassv2/images/inwdl_06.jpg" align="absmiddle">你当前还没有在学的课堂哦！快快挑选，开始学习吧！</div>';
				} else {
					for(var i = 0; i < data.page.items.length; i++){
						var tmp_class = data.page.items[i].info;
						html += '<div class="wis" onclick="javascript:open_class(\''+tmp_class.id+'\')"> \
									<img src="'+tmp_class.coverThumbnailsUrl+'" width="86" height="49" />\
								</div>';
					}
					
					for(var j= pageSize-data.page.items.length; j >0; j--){
						html += '<div class="wis"></div>';
					}
				}
			}
			$("#"+showdiv).html(html);
		}
	});
}


//根据班级id返回班级考核状态
function queryClassEvaluationResult(loginId, classId, percentDiv){
	var url= "/learning/entity/student/commonStudent_ajax.action?serviceName=wkhfaStudent&modle=getClassEvaluation";
	url += "&siteCode=" + _CSITECODE_;
	url += "&loginId=" + loginId;
	url += "&classId=" + classId;
	
	$.ajax({
		url: url,
		dataType: "json",
		beforeSend: function(data) {
			
		},
		error:function (XMLHttpRequest,textStatus, errorThrown) {
				
		},
		success: function(data) {
			if(data && data.classEvaluation){
				if(data.classEvaluation.status != '1') {
					$("#class_payBtn").show();
				}
				//设置班级考核统计状态
				var evaList = "";
				for(var i = 0; i < data.classEvaluation.componentlist.length; i++){
					var classCom = data.classEvaluation.componentlist[i];
					//设置总的学习进度百分比
					var isCoursePass = false;
					if(classCom.comcode == 'coursePass'){
						var comPercent = classCom.comScore[0];
						$("#"+percentDiv).css("width", comPercent + "%");
						evaList += '<li><span style="float:left;">'+(i+1)+'、'+classCom.comname+'</span><span class="rrr"><span class="or">'+classCom.rulelist[0].ruleScore+'%</span>/'+classCom.rulelist[0].rulerequire+'%</span><div style="clear:both"></div></li>';
						if(classCom.comstatus == '1') isCoursePass = true;
					} 
					
					//设置考试统计信息
					else if(classCom.comcode == 'classExam' ){
						evaList += '<li><span style="float:left;">'+(i+1)+'、'+classCom.comname+'</span><span class="rrr"><span class="or">'+classCom.rulelist[0].ruleScore+'</span>/'+classCom.rulelist[0].rulerequire+'</span><div style="clear:both"></div></li>';
						
						if(isCoursePass){
							$('#ctest_'+classId).css("display", "block");
							if(classCom.comstatus == '1') $('#ctestrwi_'+classId).removeClass("rwi pup").addClass("rwi");
							$('#ctestDetail_'+classId).html('得分:'+classCom.rulelist[0].ruleScore+'/'+classCom.rulelist[0].rulerequire);
						}
					}
				}
				
				evaList += '<li><span style="float:left;"></span><div style="clear:both"></div></li>';
				$("#classEvaluationList").html(evaList);
				
				
				
				//设置课程列表的完成状态
				for(var j=0; j < data.courseListStatus.length; j++){
					var e_course = data.courseListStatus[j];
					if(e_course.status == "1"){
						$("#cstatus_"+e_course.courseId).removeClass("rwzt rwzt2").addClass("rwzts");
						$("#cstatus_"+e_course.courseId).html("已完成");
					} else if( e_course.status == "-1"){
					   	$("#cstatus_"+e_course.courseId).removeClass("rwzt rwzt2");
						$("#cstatus_"+e_course.courseId).html("");
					}
				}
			}
		}
	});
}

//根据课程id返回课程考核状态
function queryCourseEvaluationResult(loginId, openCourseId){
	var url= "/learning/entity/student/commonStudent_ajax.action?serviceName=wkhfaStudent&modle=getCourseEvaluation";
	url += "&siteCode=" + _CSITECODE_;
	url += "&loginId=" + loginId;
	url += "&openCourseId=" + openCourseId;
	
	$.ajax({
		url: url,
		dataType: "json",
		beforeSend: function(data) {
			
		},
		error:function (XMLHttpRequest,textStatus, errorThrown) {
				
		},
		success: function(data) {
			if(data && data.componentlist){				
				//设置课程列表的完成状态
				for(var j=0; j < data.componentlist.length; j++){
					var tmp_com = data.componentlist[j];
					if(tmp_com.comcode == "studyTime"){
						
					} else if(tmp_com.comcode == 'homework'){
						var hwDetail = "";
						for(var r = 0; r < tmp_com.rulelist.length; r++){
							var tmp_hwrule = tmp_com.rulelist[r];
							hwDetail += tmp_hwrule.rulename + ":" + tmp_hwrule.ruleScore + "/"  + tmp_hwrule.rulerequire + "<br/>";
						}
						$("#hw_"+openCourseId).html(hwDetail);
						if(tmp_com.comstatus == '1'){
							$("#hwrwi_"+openCourseId).removeClass("rwi pup").addClass("rwi");
						}
					}
					else if(tmp_com.comcode == 'exam') {
						var testDetail = "";
						for(var r = 0; r < tmp_com.rulelist.length; r++){
							var tmp_hwrule = tmp_com.rulelist[r];
							testDetail += tmp_hwrule.rulename + ":" + tmp_hwrule.ruleScore + "/"  + tmp_hwrule.rulerequire + "<br/>";
						}
						
						$("#test_"+openCourseId).html(testDetail);
						if(tmp_com.comstatus == '1'){
							$("#testrwi_"+openCourseId).removeClass("rwi pup").addClass("rwi");
						}
					}
				}
			}
		}
	});
}

//显示用户学习笔记列表
function getNoteListByClassId(classId, curPage, pageSize){
	var ranNum = Math.random();
	var searchName = "";
	var url = "/learning/courseLog/courseLog_myStudyLogList.action?";
	url += "classId="+classId;
	url += "&searchName=";
	url += "&page.curPage="+curPage;
	url += "&page.pageSize="+pageSize;
	$.ajax({
		   type: "POST",
		   url: url,
		   success: function(data){
				$("#con3").css("display:block");
				$("#con3").html(data);
		   }
	});
}

//查询是否实名认证
function checkStudentAuthStatus(){
	$.ajax({
		   type: "POST",
		   url: "${(base)!}/entity/student/commonStudent_ajax.action",
		   data: {serviceName:"wlktStudent",modle:"settingPersonalData"},
		   cache:false,
		   dataType:"json",
		   success: function(res){
				var idcode = res.beans.idctioncode;
				var idname = res.beans.idctionname;
				var iddetail = res.beans.reason;
				_AUTHSTATUS_ = idcode;
		   }
	  });
}

function gotoAuthenticationModule(){
	var idcode = _AUTHSTATUS_;
	//设置上传实名认证信息的跳转地址
	if(idcode == '0' || idcode == '1' || idcode == '3' || idcode =='' ){
		top.document.location = "http://" + _WEB_DOMAIN_ + "/learning/entity/student/commonStudent.action?result=improvePersonalInfo&serviceName=wlktStudent&modle=getPersonalInfo";
	}else {
	}	
}
