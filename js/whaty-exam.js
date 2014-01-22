/**
 * whaty-exam API
 * 考试系统API
 * @returns {whatyexam}
 * By SIN
 * 使用方法：
 * 1.在页面上引用 jquery.js (version 1.4.1+)
 * 2.在页面引用 whaty-exam.js
 * 3.将whaty-exam.js文件中的如下var $EXAM_CONFIG = {};$EXAM_CONFIG['examUrl'] = 'http://webexam.webtrn.cn';两行代码的注释去掉  
 * 4.在页面上调用 whaty-exam 的API
 * 特别说明：该文件由网梯考试系统开发小组编写与维护，调用客户端<b>请不要</b> 修改本文件中的代码！
 */
//没有自己在页面自定义$EXAM_CONFIG，使用时请先开启如下两行注释
//如果需要连接测试平台，请在host文件中加入如下配置  192.168.11.12 webexam.webtrn.cn
var $EXAM_CONFIG = {};
//$EXAM_CONFIG['examUrl'] = 'http://exam.webtrn.cn';
$EXAM_CONFIG['examUrl'] = 'http://210.14.140.82:20228';

whatyexam = function(){};
whatyexam.prototype = {
	/**
	 学生登录接口
	 * @param siteCode   --站点编号(*必填项)
	 * @param batchCode  --考试批次(*必填项)
	 * @param loginId    --用户名(*必填项)
	 * @param name       --姓名(*必填项)
	 * @param pwd        --密码(如果不填则默认为loginId)
	 * @param gender     --性别（可直接填中文字符或者数字 1：男 0：女 ，默认值为 男   ）
	 * @param photoLink  --用户头像，图片网络地址，需要完整路径 e.g  http://www.baidu.com/images/cat.jpg
	 */
	studentLogin : function(options){
		var url = this._getExamUrl();
		
		var params = {    
			isCasUser:  '',  //是否CAS用户(*必填项)  1：是  0：否
			siteCode:   '',  //站点编号，必填项   
			batchCode:  '',  //考试编号，必填项	   
			loginId:    '',  //用户名，必填项  
			name:       '',  //姓名，必填项  
			pwd:        '',  //密码(如果不填则默认为loginId)
			gender:     '',  //--性别（可直接填中文字符或者数字 1：男 0：女 ，默认值为 男   ）
			photoLink:  ''   //用户头像，图片网络地址，需要完整路径 e.g  http://www.baidu.com/images/cat.jpg
		};  
		options = jQuery.extend(params, options);
		
		if( this._isBlank( options.siteCode ) ){
			alert('错误信息：参数siteCode不能为空!');
			return;
		}
		if( this._isBlank( options.batchCode ) ){
			alert('错误信息：参数batchCode不能为空!');
			return;
		}
		if( this._isBlank( options.loginId ) ){
			alert('错误信息：参数loginId不能为空!');
			return;
		}
		
		if( options.isCasUser != '1' ){
			options.isCasUser = '0';
		}
		if( options.isCasUser == '0'){
			if( this._isBlank( options.name ) ){
				alert('错误信息：参数name不能为空!');
				return;
			}
		}
		if( this._isBlank( options.photoLink ) ){
			photoLink = "";
		}
		
		var formTxt = '<form method="post" id="studentLoginForm" name="studentLoginForm" action="'+url+'/sso/ssoLogin_studentLogin.action?d='+new Date().getTime()+'" target="_blank" style="display:none;">'+
		'是否CAS用户：<input type="text" name="isCasUser" value="'+options.isCasUser+'"/><br/>'+
	 	'站点编号：<input type="text" name="siteCode" value="'+options.siteCode+'"/><br/>'+
	 	'考试批次编号：<input type="text" name="batchCode" value="'+options.batchCode+'"/><br/>'+
	 	'用户名：<input type="text" name="loginId" value="'+options.loginId+'"/><br/>'+
	 	'姓名：<input type="text" name="name" value="'+options.name+'"/><br/>'+
	 	'密码：<input type="text" name="passwd" value="'+options.pwd+'"/><br/>'+
	 	'性别：<input type="text" name="gender" value="'+options.gender+'"/><br/>'+
	 	'头像：<input type="text" name="photoLink" value="'+options.photoLink+'"/><br/>'+
	    '</form>';
		
		jQuery("body").append( formTxt );
		
		jQuery("#studentLoginForm").submit().remove();
	},
	/**
	 管理员登录接口
	 * @param isCasUser  --是否CAS用户(*必填项)  1：是  0：否
	 * @param siteCode   --站点编号(*必填项)
	 * @param batchCode  --考试批次(非必填项)
	 * @param loginId    --用户名(非必填项)
	 * @param name       --姓名(当isCasUser为0时必填)
	 * @param passwd     --密码(不填则默认为loginId)
	 * @param gender     --性别（可直接填中文字符或者数字 1：男 0：女 ，默认值为 男 ）
	 */
	managerLogin : function(options){
		var url = this._getExamUrl();
		var params = {  
			isCasUser: '',    //是否CAS用户(*必填项)  1：是  0：否
			siteCode:  '',    //站点编号(*必填项)   
			batchCode: '',    //考试批次(非必填项)	   
			loginId:   '',    //用户名，必填项  
			name:      '',    //姓名(当isCasUser为0时必填为 ) 
			pwd:       '',    //密码(如果不填则默认为loginId)
			gender:    ''     //性别（可直接填中文字符或者数字 1：男 0：女 ，默认值为 男 ）
		};  
		options = jQuery.extend(params, options);
		
		if( this._isBlank( options.isCasUser ) ){
			alert('错误信息：参数casUser不能为空!');
			return;
		}
		if( this._isBlank( options.siteCode ) ){
			alert('错误信息：参数siteCode不能为空!');
			return;
		}
		if( this._isBlank( options.loginId ) ){
			alert('错误信息：参数loginId不能为空!');
			return;
		}
		
		if( options.isCasUser != '1' ){
			options.isCasUser = '0';
		}
		if( options.isCasUser == '0'){
			if( this._isBlank( options.name ) ){
				alert('错误信息：参数name不能为空!');
				return;
			}
		}
		
		var formTxt = '<form method="post" id="managerLoginForm" name="managerLoginForm" action="'+url+'/sso/ssoLogin_managerLogin.action" target="_blank" style="display:none;">'+
		'是否CAS用户：<input type="text" name="isCasUser" value="'+options.isCasUser+'"/><br/>'+
		'站点编号：<input type="text" name="siteCode" value="'+options.siteCode+'"/><br/>'+
		'考试批次编号：<input type="text" name="batchCode" value="'+options.batchCode+'"/><br/>'+
		'用户名：<input type="text" name="loginId" value="'+options.loginId+'"/><br/>'+
		'姓名：<input type="text" name="name" value="'+options.name+'"/><br/>'+
		'密码：<input type="text" name="passwd" value="'+options.passwd+'"/><br/>'+
		'性别：<input type="text" name="gender" value="'+options.gender+'"/><br/>'+
		'</form>';
		
		jQuery("body").append( formTxt );
		jQuery("#managerLoginForm").submit().remove();
	},
	/**
	 教师登录接口
	 接口地址：/sso/ssoLogin_interfaceLogin.action
	 * @param isCasUser    --是否CAS用户(*必填项)  1：是  0：否
	 * @param siteCode   --站点编号(*必填项)
	 * @param batchCode  --考试批次(*必填项)
	 * @param loginId    --用户名(*必填项)
	 * @param name       --姓名(*必填项)
	 * @param passwd     --密码(如果不填则默认为loginId)
	 * @param gender     --性别（可直接填中文字符或者数字 1：男 0：女 ，默认值为 男   ）
	 * @param testLoreDirRights    --该教师所拥有的操作题库目录的权限：   题库知识点目录id，多个Id用逗号分隔
	 * @param testLoreInfoRights   --该教师所拥有的操作题库知识点的权限：  题库知识点id，多个Id用逗号分隔
	 */
	teacherLogin : function(options){
		var url = this._getExamUrl();
		
		
		var params = {  
			isCasUser: '',    //是否CAS用户(*必填项)  1：是  0：否
			siteCode:  '',    //站点编号(*必填项)   
			batchCode: '',    //考试批次(非必填项)	   
			loginId:   '',    //用户名，必填项  
			name:      '',    //姓名(当isCasUser为0时必填为 ) 
			pwd:       '',    //密码(如果不填则默认为loginId)
			gender:    '',     //性别（可直接填中文字符或者数字 1：男 0：女 ，默认值为 男 ）
			testLoreDirRights: '',     //该教师所拥有的操作题库目录的权限：   题库知识点目录id，多个Id用逗号分隔
			testLoreInfoRights: ''     //该教师所拥有的操作题库目录的权限：   题库知识点目录id，多个Id用逗号分隔
		}; 
		options = jQuery.extend(params, options);
		
		if( this._isBlank( options.isCasUser ) ){
			alert('错误信息：参数casUser不能为空!');
			return;
		}
		if( this._isBlank( options.siteCode ) ){
			alert('错误信息：参数siteCode不能为空!');
			return;
		}
		if( this._isBlank( options.batchCode ) ){
			alert('错误信息：参数batchCode不能为空!');
			return;
		}
		if( this._isBlank( options.loginId ) ){
			alert('错误信息：参数loginId不能为空!');
			return;
		}
		
		if( options.isCasUser != '1' ){
			options.isCasUser = '0';
		}
		if( options.isCasUser == '0'){
			if( this._isBlank( options.name ) ){
				alert('错误信息：参数name不能为空!');
				return;
			}
		}
		
		var formTxt = '<form method="post" id="teacherLoginForm" name="teacherLoginForm" action="'+url+'/sso/ssoLogin_interfaceLogin.action" target="_blank" style="display:none;">'+
		'loginType：<input type="text" name="loginType" value="teacher"/><br/>'+
		'是否CAS用户：<input type="text" name="isCasUser" value="'+options.isCasUser+'"/><br/>'+
		'站点编号：<input type="text" name="siteCode" value="'+options.siteCode+'"/><br/>'+
		'考试批次编号：<input type="text" name="batchCode" value="'+options.batchCode+'"/><br/>'+
		'用户名：<input type="text" name="loginId" value="'+options.loginId+'"/><br/>'+
		'姓名：<input type="text" name="name" value="'+options.name+'"/><br/>'+
		'密码：<input type="text" name="passwd" value="'+options.pwd+'"/><br/>'+
		'性别：<input type="text" name="gender" value="'+options.gender+'"/><br/>'+
		'题库目录Ids：<input type="text" name="testLoreDirRights" value="'+options.testLoreDirRights+'"/><br/>'+
		'知识点Ids：<input type="text" name="testLoreInfoRights" value="'+options.testLoreInfoRights+'"/><br/>'+
		'</form>';
		jQuery("body").append( formTxt );
		jQuery("#teacherLoginForm").submit().remove();
	},
	/**
	 * 获取考试信息
	 * @param siteCode   --站点编号(*必填项)
	 * @param batchCode  --考试编号(*必填项)
	 * @param loginId    --用户名（非必填）
	 * @param name       --用户名（非必填）
	 * @param callback   --回调函数，请自行解析返回的数据
	 * 返回值datas为json数组: [
		    {"loginId":"linda","name":"Linda","score":70.0},
		    {"loginId":"jack","name":"Jack","score":86.0}
		   ]
	 * eg function handleExamData(datas){
	 * 		for(var data in datas ){
	 * 			alert( 'loginId:' + data.loginId + 'name:'+ data.name +'score:' + data.score);
	 *      }
	 * }
	 */
	getJsonExamdata:function(options){
		var url = this._getExamUrl();
		
		var params = {  
			siteCode:  '',    //站点编号(*必填项)   
			batchCode: '',    //考试批次(非必填项)	   
			loginId:   '',    //用户名(非必填项)
			name:      '',    //姓名(非必填项) 
			callback : null
		};  
		options = jQuery.extend(params, options);
		
		if( this._isBlank( options.siteCode ) ){
			alert('错误信息：参数siteCode不能为空!');
			return;
		}
		if( this._isBlank( options.batchCode )){
			alert('请填写考试批次');
			return; 
		}
		jQuery.getJSON( url + "/college/exam/schoolstatistics/schoolstatistics_getJsonExamdata.action?jsoncallback=?" , {"examBatch.serialNumber":options.batchCode,"name":options.name,"loginId":options.loginId},options.callback);
	},
	/**
	 *  获取已经开启的随机卷考试
	 * @param siteCode  --考试编号(*必填项)
	 * @param callback   --回调函数，请自行解析返回的数据
	 * 返回值json 数组，
	 * [{
		"batchCode": "test001",
		"name": "test001",
		"examTime": 30,
		"createDate": 1335146491000
		},
		{
			"batchCode": "test001",
			"name": "test001",
			"examTime": 30,
			"createDate": 1335146491000
		}]
	 * 
	 * 
	 * 数组中的值为：
	 * batchCode  --考试编号
	 * name       --考试名称
	 * examTime   --考试时间
	 * createDate --创建日期
	 */
	getStartedExercises:function(options){
		var url = this._getExamUrl();
		
		var params = {  
				siteCode:  '',    //站点编号(*必填项)   
				callback : null
		};  
		options = jQuery.extend(params, options);
		if( this._isBlank( options.siteCode ) ){
			alert('错误信息：参数siteCode不能为空!');
			return;
		}
		jQuery.getJSON( url + "/college/exam/examBatch_getStartedExercises.action?jsoncallback=?" , {"siteCode":options.siteCode},options.callback);
	},
	/**
	 * 获取随机卷考试成绩
	 * @param siteCode   --站点编号(*必填项)
	 * @param batchCode  --考试编号(*必填项)
	 * @param loginId    --用户名（非必填）
	 * @param name       --用户名（非必填）
	 * @param callback   --回调函数，请自行解析返回的数据
	 * eg function handleExamData(datas){
	 * 		for(var data in datas ){
	 * 			alert( 'loginId:' + data.loginId + 'name:'+ data.name +'score:' + data.score);
	 *      }
	 * }
	 */
	getExerciseJsonData:function(options){
		var url = this._getExamUrl();
		
		var params = {  
				siteCode:  '',    //站点编号(*必填项)   
				batchCode: '',    //考试批次(非必填项)	   
				loginId:   '',    //用户名(非必填项)
				name:      '',    //姓名(非必填项) 
				callback : null
		};  
		options = jQuery.extend(params, options);
		
		if( this._isBlank( options.siteCode ) ){
			alert('错误信息：参数siteCode不能为空!');
			return;
		}
		if(this._isBlank( options.batchCode )){
			alert('请填写考试批次');
			return;
		}
		jQuery.getJSON( url + "/college/exam/schoolstatistics/schoolstatistics_getExerciseJsonData.action?jsoncallback=?" , {"batchCode":options.batchCode,"name":options.name,"loginId":options.loginId},options.callback);
	},
	/**
	 * 判断字符串是否为空
	 * 内部函数
	 * @param str
	 * @returns {Boolean}
	 */
	_isBlank:function( str ){
		if(typeof(str) == 'undefined' || str == null || str.length == 0 || str == '' || str == 'null'){
			return true;
		}else{
			return false;
		}
	},
	/**
	 * 获取考试系统连接
	 * 内部函数
	 */	
	_getExamUrl:function(){
		if( typeof($EXAM_CONFIG) == 'undefined' || typeof($EXAM_CONFIG['examUrl']) == 'undefined'){
			alert('考试系统地址参数尚未初始化!请先初始化参数');
			return "badUrl";
		}else{
			return $EXAM_CONFIG.examUrl;
		}
	}
};

whatyexam = new whatyexam();
whatyexam.plugin = {};
//拓展
jQuery.extend(whatyexam.plugin, {
	sayHello:function(){
		alert("hello!");
	}
});