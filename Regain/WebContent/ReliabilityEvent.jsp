<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@include file="regain_design_header.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Reliability Event</title>
</head>
<script type="text/javascript" src="Reliability.js"></script>
<body>
	<div>
		<table>
			<tr>
				<td><label id="Project_Id_Main"> </label></td>
				<td><label id="Project_Desc_Main"> </label></td>
			</tr>
		</table>
	</div>
</body>
<script>
var gsProjectId = "";

$(document).ready(GetUserRoles('PreparePage'));
gsCurrentPage = "Details";	

function  PreparePage()
{
	DisableDesignMenus();
	OpenThisPage();
	$.get('ProjectHeader', ProjHdrLoadSucc);
}

function OpenThisPage()
{
	gsProjectId = UrlFullDecode(getQuerystring(window.location.href,'ProjectId'));
//	SetObjectValue("Project_Id_Main", gsProjectId);
	ReliabilityEvent_BlankPopulate();
}
	
function ProjHdrLoadSucc(data)
{
	var sDesc = data;
//	SetObjectValue("Project_Desc_Main", sDesc);
//	SetObjectValue("MenuDescriptionId", sDesc);	
}

function Get_ReadOnly_Flag()
{
	return 0;	
}
</script>
<p style="font-family: Arial; font-size: 18pt;font-weight: bold">Reliability Event</p>
	<div id="ReliabilityEventGridDataContainer" style="width: 510px; height: 370px">
	</div>
	<div id="fade"></div>
	<div id="modal">
		<img id="loader" src="images/loading.gif" />
	</div>

</html>