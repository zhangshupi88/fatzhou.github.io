// JScript 文件

function Browser()
{
	var ua, s, i;
	this.isIE = false;
	this.isNS = false;
	this.isOP = false;
	this.isSF = false;
	ua = navigator.userAgent.toLowerCase();
	s = "opera";
	if ((i = ua.indexOf(s)) >= 0)
	{
		this.isOP = true;return;
	}
	s = "msie";
	if ((i = ua.indexOf(s)) >= 0)
	{
		this.isIE = true;return;
	}
	s = "netscape6/";
	if ((i = ua.indexOf(s)) >= 0)
	{
		this.isNS = true;return;
	}
	s = "gecko";
	if ((i = ua.indexOf(s)) >= 0)
	{
		this.isNS = true;return;
	}
	s = "safari";
	if ((i = ua.indexOf(s)) >= 0)
	{
		this.isSF = true;return;
	}
}

function ScreenConvert()
{
	var browser = new Browser();
	var objScreen = document.getElementById("ScreenOver");
	if(!objScreen)
	{
		var objScreen = document.createElement("div");
	}
	var oS = objScreen.style;
	objScreen.id = "ScreenOver";
	oS.display = "block";
	oS.top = oS.left = oS.margin = oS.padding = "0px";
	if (document.body.clientHeight)
	{
		var wh = document.body.clientHeight + "px";
	}
	else if (window.innerHeight)
	{
		var wh = window.innerHeight + "px";
	}
	else
	{
		var wh = "100%";
	}
	oS.width = "100%";
	oS.height = $("#sh").height()+ 414 + "px";
		oS.position = "absolute";
	oS.zIndex = "9998";
	if ((!browser.isSF) && (!browser.isOP))
	{
		oS.background = "#181818";
	}
	else
	{
		oS.background = "#F0F0F0";
	}
	oS.filter = "alpha(opacity=40)";
	oS.opacity = 40/100;
	oS.MozOpacity = 40/100;
	document.body.appendChild(objScreen);
	//HiddenControl("select");
//	HiddenControl("embed");
//	HiddenControl("object");
}

function DialogLoc()
{
	var dde = document.documentElement;
	if (window.innerWidth)
	{
		var ww = window.innerWidth;
		var wh = window.innerHeight;
		var bgX = window.pageXOffset;
		var bgY = window.pageYOffset;
	}
	else
	{
		var ww = dde.offsetWidth;
		var wh = dde.offsetHeight;
		var bgX = dde.scrollLeft;
		var bgY = dde.scrollTop;
	}
	t_DiglogX = (bgX + ((ww - t_DiglogW)/2));
	t_DiglogY = (bgY + ((wh - t_DiglogH)/2));
}

function DialogShow(code,ow,oh,w,h)
{
	var objDialog = document.getElementById("DialogMove");
	if (!objDialog)
	{
		objDialog = document.createElement("div");
	}
	t_DiglogW = ow;
	t_DiglogH = oh;
	DialogLoc();
	objDialog.id = "DialogMove";
	var oS = objDialog.style;
	oS.display = "block";
	oS.top = t_DiglogY + "px";
	oS.left = t_DiglogX + "px";
	oS.margin = "0px";
	oS.padding = "0px";
	oS.width = w + "px";
	oS.height = h + "px";
	oS.position = "absolute";
	oS.zIndex = "9999";
	oS.background = "#FFF";
	oS.border = "solid #4C4C4C 3px";
	objDialog.innerHTML = code;
	document.body.appendChild(objDialog);
}

function ChildScreenClean()
{
    var objScreen = window.document.getElementById("ScreenOver");
    if (objScreen)
    {
        objScreen.style.display = "none";
    }
    //VisibleControl("select");
//    VisibleControl("embed");
//    VisibleControl("object");
}
// 关闭弹出的子窗口
function ChildDialogHide()
{
    ChildScreenClean();
    var objDialog = window.document.getElementById("DialogMove");
    if (objDialog)
    {
        objDialog.style.display = "none";
    }
}

//根据传进来的参数弹出小页面
function ShowPopupPage(width, height, url)
{
    ScreenConvert();
    var ShowData = "<iframe marginwidth=\"0\" marginheight=\"0\" frameborder=\"0\" scrolling=\"no\" src=\"" + url + "\" width=\"" + width + "\" height=\"" + height + "\"></iframe>";
    DialogShow(ShowData,width,height,width,height);
}