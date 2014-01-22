//获取url中的参数值
function getUrlParam(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}

$.blockUI.defaults.css.cursor = 'default';
$.blockUI.defaults.overlayCSS.opacity = '0.3'; 
$.blockUI.defaults.css.top = "15%";


//弹出层
function popup(id, canhide, size){
	if(!id)	return false;
	canhide = canhide || false;
	size = size || 'small'; //大或小的框
	var h_ght =  - $('#'+id).height()/2;
	if(size=='small')
	{
		$('#'+id).css("top", "-10px");
		$.blockUI({ 
			message: $('#'+id), 
			css: { 
				textAlign:	'center',
				marginLeft:     '-500px', 
				width: '400px',
				background: '#000'
			}
		});
	}
	else
	{
		$.blockUI({ 
			message: $('#'+id),
			css: { 
				top:		'45%',
				left:		'50%',
				textAlign:	'left',
				marginLeft:     '-350px', 
				marginTop:      h_ght, 
				width: '700px',
				background:'none'
			} 
		}); 
	}
	$('#'+id).find('.close').live('click',function(){
		$.unblockUI();
		$('#'+id).css("top", "-1000px");
	});
	$('#'+id).find('.close').click($.unblockUI);
	if( canhide )
	{
		setTimeout($.unblockUI,2000);
		$('#'+id).click(function(){
			return false;
		});
	}
}

//计算两个日期相差值
function getDateIntervalWithNow(in_date){
	var  str=in_date.toString();
    str =  str.replace(/-/g,"/");
	var date1 = new Date(str);
	var date2=new Date();  //开始时间
	var date3=date2.getTime()-date1.getTime()  //时间差的毫秒数
	
	//计算出相差天数
	var days=Math.floor(date3/(24*3600*1000));
	 
	//计算出小时数
	var leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
	var hours=Math.floor(leave1/(3600*1000));
	
	//计算相差分钟数
	var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
	var minutes=Math.floor(leave2/(60*1000));

	//计算相差秒数
	var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
	var seconds=Math.round(leave3/1000);
	
	var backStr = "";
	if(days > 0){
		if(days > 20){ 
			backStr = date1.pattern("yyyy-MM-dd");  //"2013-12-30"; //in_date.toString();
		}else {
			backStr = days+"天前";
		}
	}else if(hours > 0){
		backStr =  hours+"小时前";
	} else if(minutes > 0){
		backStr =  minutes+"分钟前";
	} else {
		backStr =  "刚刚";
	}
	return backStr;
}

function isInputDateValid(in_date) {
	var  str=in_date.toString();
    str =  str.replace(/-/g,"/");
	var date1 = new Date(str);
	var date2=new Date();  //开始时间
	var date3=date2.getTime()-date1.getTime()  //时间差的毫秒数
	if(date3 > 0){
		return false;
	} else {
		return true;
	}
}

Date.prototype.pattern=function(fmt) {    
	var o = {       
		"M+" : this.getMonth()+1, //月份       
		"d+" : this.getDate(), //日       
		"h+" : this.getHours() == 0 ? 12 : this.getHours(), //小时       
		"H+" : this.getHours(), //小时       
		"m+" : this.getMinutes(), //分       
		"s+" : this.getSeconds(), //秒       
		"q+" : Math.floor((this.getMonth()+3)/3), //季度       
		"S" : this.getMilliseconds() //毫秒       
	};
	var week = {"0":"\u65e5","1":"\u4e00","2":"\u4e8c","3":"\u4e09","4":"\u56db","5":"\u4e94","6":"\u516d"};       
	if(/(y+)/.test(fmt)){       
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));       
	}       
	if(/(E+)/.test(fmt)){       
		fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);       
	}       
	for(var k in o){       
		if(new RegExp("("+ k +")").test(fmt)){       
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));       
		}     
	}    
	var m = {
		"s":"m",
		"d":"h"
	};
	return fmt;       
}

//分页导航显隐公共函数
function MM_showHideLayers() { //v9.0
  var i,p,v,obj,args=MM_showHideLayers.arguments;
  for (i=0; i<(args.length-2); i+=3) 
  with (document) if (getElementById && ((obj=getElementById(args[i]))!=null)) { v=args[i+2];
    if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v=='hide')?'hidden':v; }
    obj.visibility=v; }
}


//根据班级Id 获取学员列表
function getStudentListByClassId(classId, web_domain, stutotal_divid, stulist_divid) {
	var url = "/learning/entity/student/commonStudent_ajax.action?serviceName=wlktStudent&modle=getStudentMapsByClassId";
	url +=  "&classId="+ classId +"&web_domain="+web_domain;
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
				html += '<div class="ktxyi"><img src="/learning'+stulist[i]["avatar.big"]+'" width="55" height="55" /></div>';
			}
			
			html += '<div style="clear:both"></div>';
			$('#'+stulist_divid).html(html);
			$('#'+stutotal_divid).html( '<img src="../../wyclassv2/images/tp_06.png" width="20" height="20" align="absmiddle"  alt=""/>' +stulist.length + '位学员已加入课堂');
		}
	});
}

//0：相等; <0 后者小; >0  后者大;
function comptime(inDateTime){
	//获取起始日期  
	 var inputDateTime=inDateTime.replace(/-/g,"/");  
	 var dateNow = new Date();
	 
	 //如果起始日期大于结束日期  
	 return Date.parse(inputDateTime)-Date.parse(dateNow);
}