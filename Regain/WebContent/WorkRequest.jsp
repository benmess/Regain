<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@include file="regain_design_header.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Work Request</title>
</head>
<script type="text/javascript" src="WorkRequest.js"></script>
<body>
</body>
<script>
var gsProjectId = "";

$(document).ready(GetUserRoles('PreparePage'));
gsCurrentPage = "Work Request";	

function  PreparePage()
{
	DisableDesignMenus();
	OpenThisPage();
}

function OpenThisPage()
{
	WorkRequest_BlankPopulate();
}
	
function Get_ReadOnly_Flag()
{
	return 0;	
}
</script>
<p style="font-family: Arial; font-size: 18pt;font-weight: bold">Work Request</p>
	<div id="WorkRequestGridDataContainer" style="width: 510px; height: 420px">
	</div>
	<div id="fade"></div>
	<div id="modal">
		<img id="loader" src="images/loading.gif" />
	</div>

</html>