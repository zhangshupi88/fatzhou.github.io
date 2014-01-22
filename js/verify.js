$().ready( function() {
	var verify=document.getElementById('img_data');
	if(erroNum <ERROR_NUM){
		verify.setAttribute('src','');
		jQuery("#showCode").hide();
		$("#authCode").attr('disabled', true);
	}else{
		verify.setAttribute('src','http://210.14.140.82:9201/verifyCodeImg');
		$(".idx").css("margin-top","7px");
		jQuery("#showCode").show();
	}
});

function reloadcode(){
	var verify=document.getElementById('img_data');
	verify.setAttribute('src','http://210.14.140.82:9201/verifyCodeImg?'+Math.random());
}