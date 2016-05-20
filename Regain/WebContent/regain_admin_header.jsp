<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<!--  <title>PIMS Header</title> -->
<!-- SmartMenus core CSS (required) -->
<link href='css/sm-core-css.css' rel='stylesheet' type='text/css' />
<!-- "sm-blue" menu theme (optional, you can use your own CSS, too) -->
<link href='css/sm-blue/sm-darkblue.css' rel='stylesheet' type='text/css' />
<link rel="stylesheet"
	href="//code.jquery.com/ui/1.11.0/themes/smoothness/jquery-ui.css">
<link href="Shared/rich_calendar/rich_calendar.css" rel="stylesheet" type="text/css" />
<style type="text/css">
#pims-menu .extramenu {
	position: relative;
	z-index: 9999;
	width: auto;
}

#pims-menu ul {
	width: 12em;
	/* fixed width only please - you can use the "subMenusMinWidth"/"subMenusMaxWidth" script options to override this if you like */
}
</style>
<link rel="StyleSheet" href="Shared/PIMS_Stylesheet.css" type="text/css" />

<script src="//code.jquery.com/jquery-latest.min.js"></script>
<script src="//code.jquery.com/ui/1.11.0/jquery-ui.js"></script>
<script type="text/javascript" src="Shared/Common.js"></script>
<script type="text/javascript" src="Shared/rich_calendar/rich_calendar.js" > </script>
<script type="text/javascript" src="Shared/rich_calendar/rc_lang_en.js" > </script>
<script type="text/javascript" src="Shared/soapclient.js"></script>
<script src="Shared/jquery.smartmenus.js" type="text/javascript"></script>
<script type="text/javascript">

$(document).on("keydown", function (e) 
{
	NoBackspace(e);
    
});		

</script>
</head>
<script type="text/javascript">
var iTimeOutID;
var iLastUserTime;
var iTimeOut = 1800000; //This is the time that it will logout if inactive (in milliseconds)
var iUserTimeOut = 30000;
var t = new Date();
var gt = new Date();
iLastUserTime = t.getDate();

function SetEditStatus(iStatus)
{
	SetObjectValue("RegainEditStatus", iStatus);
	SetUnsavedChangesLabel(iStatus);
	return;	
}

function SetUnsavedChangesLabel(iStatus)
{
	if(iStatus == 1 || iStatus == -1)
	{
		document.getElementById("EditStatusLabel").style.visibility = 'visible';	
	}
	else
	{
		document.getElementById("EditStatusLabel").style.visibility = 'hidden';	
	}
	return;
}

function GetEditStatus()
{
	return GetObjectValue('RegainEditStatus');
}

function expireSession()
{     
    if(GetBrowserType() == 4 ||GetBrowserType() == 2)
    {
        var t_now = new Date();        
        if((t_now.getTime() - iLastUserTime) > iTimeOut)
        {
              window.location = 'Logout.jsp';
        } 
    }
    else
    {
        window.location = 'Logout.jsp';
    }
}

iTimeOutID = setTimeout('expireSession()',iTimeOut);

function admin_hdr_onmousemove()
{
    clearTimeout(iTimeOutID);     
    iTimeOutID = setTimeout('expireSession()',iTimeOut);    
    var tCompare = new Date();
    
    if((tCompare.getTime() - iLastUserTime) > iUserTimeOut)
    {
        UpdateUserTime();
    }
}

function admin_hdr_onkeypress()
{
    clearTimeout(iTimeOutID);     
    iTimeOutID = setTimeout('expireSession()',iTimeOut);    
    var tCompare = new Date();
    
    if((tCompare.getTime() - iLastUserTime) > iUserTimeOut)
    {
        UpdateUserTime();
    }
}

function UpdateUserTime()
{
        var newT = new Date();
        iLastUserTime = newT.getTime();
        var curr_hour = PadStringWithZeros(newT.getHours(), 2 , true);
        var curr_min =  PadStringWithZeros(newT.getMinutes(), 2 , true);
        var curr_sec = PadStringWithZeros(newT.getSeconds(), 2, true); 
        var sFinalTime = curr_hour + ":" + curr_min + ":" + curr_sec;
        SetObjectValue(document.getElementById('UsernameId').id,GetUserId()); 
        SetObjectValue(document.getElementById('ActivityTime').id,sFinalTime); 
        Set_User_Time();
}

function Set_User_Time()
{
    if(window.GetUserId)
    {
        var sUser = GetUserId();
        var sSessionId = GetSessionId();
        var iWebAppId = GetWepAppId();
        var url = GetWebServiceRoot() + "WbsUser";
    	var parameters = new SOAPClientParameters();
    	parameters.add("sSessionId",sSessionId);		        
    	parameters.add("sUsername",sUser);		        
    	parameters.add("iWebAppId",iWebAppId);		        
        SOAPClient.invoke(url,"update_User_Time",parameters,true,UserTimeSuccess);
    }
}

function UserTimeSuccess()
{
}

function GetSessionId()
{
	return <%	if(session.getId() != null){ %>'<%= session.getId() %>';<%}
				else {%>'';<%}%>
} 

function GetWepAppId()
{
	return <%	if(session.getAttribute("webappid") != null){ %>'<%= session.getAttribute("webappid").toString() %>';<%}
	else {%>'';<%}%>
} 

function GetUserId()
{
	return <%	if(session.getAttribute("username") != null){ %>'<%= session.getAttribute("username").toString() %>';<%}
				else {%>'';<%}%>
} 

function GetReadOnlyStatus()
{
	return<%	if(session.getAttribute("readonly") != null){ %> parseInt('<%= session.getAttribute("readonly").toString() %>',10);<%}
				else {%> parseInt('0',10);<%}%>
} 


function OpenMenuPage()
{
	SetObjectValue("UsernameId", GetUserId());	
}
	
</script>

<body onmousemove="admin_hdr_onmousemove()"
	onkeypress="admin_hdr_onkeypress()">
	<table class="NoCellSpacing">
		<tr>
			<td style="width: 50px" class="grdRowTextAligRight BackgroundLightOrange"><label
				id="UsernameLabel"
				class="grdfont grdfont10 grdfontBold grdfontItalic">User:</label></td>
			<td style="width: 100px" class="grdRowTextAligLeft BackgroundLightOrange"><label
				id="UsernameId" class="grdfont grdfont10 grdfontBold grdfontItalic"></label>
			</td>
			<td style="width: 100px" class="grdRowTextAligRight BackgroundLightOrange"><label
				id="ActivityLabel"
				class="grdfont grdfont10 grdfontBold grdfontItalic">Last
					Activity:</label></td>
			<td style="width: 100px" class="grdRowTextAligLeft BackgroundLightOrange"><label
				id="ActivityTime"
				class="grdfont grdfont10 grdfontBold grdfontItalic"></label></td>
			<td style="width: 100px" class="grdRowTextAligLeft"><img  id="ReganiLogo1" alt="RegainLogo" src="RegainLogo.png" style="width: 100px;" ></td>
		</tr>
	</table>
	<table>
		<tr>
			<td>
				<ul id="pims-admin-menu" class="sm sm-blue">
					<li id="pims-menu-homeitem"><a id="pims-menu-homeitemhref"
						href="#"><img id="pims-menu-homeitemimage"
							src="images/home3.png" style="height: 30px; width: 30px"
							alt="Home" /></a></li>
					<li id="pims-menu-documentation"><a id="pims-menu-documentationhref" href="#">Documentation</a>
						<ul id="pims-menu-documentationsubmenu">
							<li id="pims-menu-documentcreation"><a id="pims-menu-documentcreationhref"
								href="#">Create or Update</a></li>
							<li id="pims-menu-documentsearch"><a id="pims-menu-documentsearchhref"
								href="#">Document Search</a>
								<ul id="pims-menu-documentationsearchsubmenu">
									<li id="pims-menu-documentsearchbydoc"><a id="pims-menu-documentsearchbydocref"
										href="#">Search by Document</a></li>
									<li id="pims-menu-documentsearchbyfl"><a id="pims-menu-documentsearchbyflhref"
										href="#">Search by Plant Equipment</a></li>
								</ul>
							</li>
								
						</ul></li>
					<li id="pims-menu-admin"><a id="pims-menu-adminhref" href="#">Admin</a>
						<ul id="pims-menu-adminsubmenu">
							<li id="pims-menu-useradmin"><a id="pims-menu-useradminhref"
								href="#">User Admin</a></li>
							<li id="pims-menu-docaccess"><a id="pims-menu-docaccesshref"
								href="#">Documentation Access</a></li>
							<li id="pims-menu-actionrequestreport"><a id="pims-menu-actionrequestreporthref"
								href="#">Action Request Report</a></li>
						</ul></li>
					<li id="pims-menu-logout"><a id="pims-menu-logouthref"
						href="#">Logout</a></li>
				</ul>
			</td>
			<td><input type="hidden" id="RegainEditStatus" value="0">
				<label id="EditStatusLabel"
				style="background-color: red; font-weight: bold; font-size: 14pt; font-family: Arial; visibility: hidden">UNSAVED
					CHANGES</label></td>
		</tr>
	</table>

</body>
<script type="text/javascript">
$(function() {
	$('#pims-admin-menu').smartmenus(
	{
		subMenusSubOffsetX: 1,
		subMenusSubOffsetY: -8
	});
});	

$('#pims-admin-menu').bind('select.smapi', function(e, item) 
{

	if(item.children.length >0)
	{
		var child = item.children[0];
		if(child.tagName == "IMG")
		{
			OpenMenuItem(GetObjectValue(child));
		}
		else
		{
			var sMenu = GetObjectValue(item);
			var sExtra = "";
			OpenMenuItem(sMenu, sExtra);				
		}
	}
	else
	{
		var sMenu = GetObjectValue(item);
		var sExtra = "";
		OpenMenuItem(sMenu, sExtra);				
	}
});

	OpenMenuPage();
	CheckLogoutRegain();
</script>
</html>